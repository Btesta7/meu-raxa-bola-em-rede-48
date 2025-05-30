
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  const { isAuthenticated, isLoading, isNewUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isNewUser) {
      // Redirect new users to onboarding immediately
      navigate('/onboarding');
    } else if (isAuthenticated && !isNewUser) {
      // Redirect existing users to dashboard
      navigate('/');
    }
  }, [isAuthenticated, isNewUser, navigate]);

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

  // Don't render the form if user is already authenticated
  if (isAuthenticated) {
    return null;
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
