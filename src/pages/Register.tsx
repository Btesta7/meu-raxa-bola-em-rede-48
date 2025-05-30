
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  const { isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout 
      title="Criar conta" 
      subtitle="Junte-se à comunidade do Meu Raxa"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;

