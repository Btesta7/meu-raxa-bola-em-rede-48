
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="size-8 text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a9.96 9.96 0 0 0-6.33 2.258c-.22.189.05.523.287.506 2.1-.148 5.445.648 7.223 2.426 1.77 1.77 2.568 5.098 2.426 7.202-.017.236.317.507.506.287A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              <path d="M12 22a9.96 9.96 0 0 0 6.33-2.258c.22-.189-.05-.523-.287-.506-2.1.148-5.445-.648-7.223-2.426-1.77-1.77-2.568-5.098-2.426-7.202.017-.236-.317-.507-.506-.287A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10Z" />
            </svg>
            <h1 className="text-2xl font-bold text-primary">Meu Raxa</h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;

