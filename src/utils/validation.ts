
import { RegisterData, AuthCredentials } from '@/types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[!@#$%^&*])/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateLoginForm = (credentials: AuthCredentials): string[] => {
  const errors: string[] = [];
  
  if (!credentials.email) {
    errors.push('Email é obrigatório');
  } else if (!validateEmail(credentials.email)) {
    errors.push('Email inválido');
  }
  
  if (!credentials.password) {
    errors.push('Senha é obrigatória');
  }
  
  return errors;
};

export const validateRegisterForm = (data: RegisterData): string[] => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (!data.email) {
    errors.push('Email é obrigatório');
  } else if (!validateEmail(data.email)) {
    errors.push('Email inválido');
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  if (data.password !== data.confirmPassword) {
    errors.push('Senhas não coincidem');
  }
  
  if (!data.position) {
    errors.push('Posição é obrigatória');
  }
  
  return errors;
};

