
import { PasswordResetRequest } from '@/types/passwordReset';
import { toast } from '@/components/ui/sonner';

class PasswordResetService {
  private requests: Map<string, PasswordResetRequest> = new Map();
  private readonly EXPIRY_MINUTES = 15;
  private readonly MAX_ATTEMPTS = 3;
  private readonly RATE_LIMIT_MINUTES = 60;
  private rateLimitMap: Map<string, { count: number; resetTime: Date }> = new Map();

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private isRateLimited(email: string): boolean {
    const rateLimit = this.rateLimitMap.get(email);
    if (!rateLimit) return false;

    const now = new Date();
    if (now > rateLimit.resetTime) {
      this.rateLimitMap.delete(email);
      return false;
    }

    return rateLimit.count >= this.MAX_ATTEMPTS;
  }

  private updateRateLimit(email: string): void {
    const now = new Date();
    const resetTime = new Date(now.getTime() + this.RATE_LIMIT_MINUTES * 60000);
    
    const existing = this.rateLimitMap.get(email);
    if (existing && now < existing.resetTime) {
      existing.count++;
    } else {
      this.rateLimitMap.set(email, { count: 1, resetTime });
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    // Check rate limiting
    if (this.isRateLimited(email)) {
      return {
        success: false,
        message: 'Muitas tentativas. Tente novamente em 1 hora.',
      };
    }

    // Generate new code
    const code = this.generateCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.EXPIRY_MINUTES * 60000);

    const request: PasswordResetRequest = {
      id: `reset-${Date.now()}`,
      email: email.toLowerCase(),
      code,
      createdAt: now,
      expiresAt,
      used: false,
      attempts: 0,
    };

    // Invalidate any existing requests for this email
    for (const [key, value] of this.requests.entries()) {
      if (value.email === email.toLowerCase()) {
        this.requests.delete(key);
      }
    }

    this.requests.set(request.id, request);
    this.updateRateLimit(email);

    // Simulate email sending
    this.simulateEmailSend(email, code);

    return {
      success: true,
      message: 'Código de recuperação enviado para seu email.',
    };
  }

  async verifyCode(email: string, code: string): Promise<{ success: boolean; message: string; requestId?: string }> {
    const request = Array.from(this.requests.values()).find(
      r => r.email === email.toLowerCase() && !r.used
    );

    if (!request) {
      return {
        success: false,
        message: 'Código não encontrado ou já utilizado.',
      };
    }

    if (new Date() > request.expiresAt) {
      this.requests.delete(request.id);
      return {
        success: false,
        message: 'Código expirado. Solicite um novo código.',
      };
    }

    if (request.attempts >= this.MAX_ATTEMPTS) {
      this.requests.delete(request.id);
      return {
        success: false,
        message: 'Muitas tentativas incorretas. Solicite um novo código.',
      };
    }

    if (request.code !== code) {
      request.attempts++;
      return {
        success: false,
        message: `Código incorreto. ${this.MAX_ATTEMPTS - request.attempts} tentativas restantes.`,
      };
    }

    return {
      success: true,
      message: 'Código verificado com sucesso.',
      requestId: request.id,
    };
  }

  async resetPassword(requestId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const request = this.requests.get(requestId);

    if (!request) {
      return {
        success: false,
        message: 'Solicitação não encontrada.',
      };
    }

    if (request.used) {
      return {
        success: false,
        message: 'Este código já foi utilizado.',
      };
    }

    if (new Date() > request.expiresAt) {
      this.requests.delete(requestId);
      return {
        success: false,
        message: 'Código expirado.',
      };
    }

    // Mark as used
    request.used = true;

    // In a real app, this would update the user's password in the database
    console.log(`Password reset for ${request.email} with new password: ${newPassword}`);

    // Clean up
    this.requests.delete(requestId);

    return {
      success: true,
      message: 'Senha alterada com sucesso.',
    };
  }

  private simulateEmailSend(email: string, code: string): void {
    // In development, show the code in a toast
    if (process.env.NODE_ENV === 'development') {
      toast.info(`Código de recuperação: ${code}`, {
        duration: 10000,
        description: 'Em produção, este código seria enviado por email',
      });
    }

    console.log(`Email sent to ${email} with code: ${code}`);
  }

  // Cleanup expired requests periodically
  private cleanup(): void {
    const now = new Date();
    for (const [key, request] of this.requests.entries()) {
      if (now > request.expiresAt) {
        this.requests.delete(key);
      }
    }
  }

  constructor() {
    // Run cleanup every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
}

export const passwordResetService = new PasswordResetService();
