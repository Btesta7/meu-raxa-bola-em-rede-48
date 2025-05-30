
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthCredentials } from '@/types';

const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useUserContext();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(credentials);
    if (success) {
      navigate('/');
    }
  };

  const handleInputChange = (field: keyof AuthCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={credentials.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-9"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-9 pr-9"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={credentials.rememberMe}
            onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
            Lembrar-me
          </Label>
        </div>
        
        <Link 
          to="/forgot-password" 
          className="text-sm text-primary hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Não tem uma conta? </span>
        <Link to="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </div>

      {/* Dica para demonstração */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700 mb-2 font-medium">💡 Para demonstração, use:</p>
        <p className="text-xs text-blue-600">Email: qualquer dos usuários existentes</p>
        <p className="text-xs text-blue-600">Senha: password + ID do usuário (ex: password1)</p>
      </div>
    </form>
  );
};

export default LoginForm;

