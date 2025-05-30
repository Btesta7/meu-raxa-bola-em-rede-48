
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { validateEmail } from '@/utils/validation';
import { toast } from '@/components/ui/sonner';
import { passwordResetService } from '@/services/passwordResetService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await passwordResetService.requestPasswordReset(email);
      
      if (result.success) {
        setEmailSent(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao enviar código de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  if (emailSent) {
    return (
      <AuthLayout 
        title="Email enviado!" 
        subtitle="Verifique sua caixa de entrada"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enviamos um código de recuperação para:
            </p>
            <p className="font-medium">{email}</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              O código expira em 15 minutos. Não recebeu? Verifique sua pasta de spam.
            </p>
            
            <Button 
              onClick={handleContinue}
              className="w-full"
            >
              Continuar com o código
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Tentar outro email
            </Button>
            
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft size={16} className="mr-2" />
                Voltar ao login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Recuperar senha" 
      subtitle="Digite seu email para receber o código de recuperação"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar código de recuperação'}
        </Button>

        <Link to="/login">
          <Button variant="ghost" className="w-full">
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao login
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
