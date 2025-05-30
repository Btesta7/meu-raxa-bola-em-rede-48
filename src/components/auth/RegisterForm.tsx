
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, CheckCircle, XCircle } from 'lucide-react';
import { RegisterData, PlayerPosition } from '@/types';
import { validateEmail, getPasswordStrength } from '@/utils/validation';

const positions: PlayerPosition[] = ["Goleiro", "Defensor", "Meio-campista", "Atacante"];

const RegisterForm: React.FC = () => {
  const { register, isEmailAvailable, isLoading, error, clearError } = useUserContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    position: 'Meio-campista'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setFieldErrors({ terms: 'Você deve aceitar os termos de uso' });
      return;
    }
    
    clearError();
    setFieldErrors({});
    
    const success = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erros quando o usuário começar a digitar
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();

    // Validação em tempo real
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Email inválido' }));
      } else if (!isEmailAvailable(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Este email já está em uso' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (field === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }));
      } else {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (field === 'password' && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }));
      } else {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isEmailValid = validateEmail(formData.email) && isEmailAvailable(formData.email);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-9"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`pl-9 pr-9 ${fieldErrors.email ? 'border-destructive' : isEmailValid && formData.email ? 'border-green-500' : ''}`}
            disabled={isLoading}
            required
          />
          {formData.email && (
            <div className="absolute right-3 top-3">
              {isEmailValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Posição preferida</Label>
        <Select 
          value={formData.position} 
          onValueChange={(value: PlayerPosition) => handleInputChange('position', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione sua posição" />
          </SelectTrigger>
          <SelectContent>
            {positions.map(position => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Crie uma senha forte"
            value={formData.password}
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
        {formData.password && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === 'weak' ? 'bg-red-400 w-1/3' :
                    passwordStrength === 'medium' ? 'bg-yellow-400 w-2/3' :
                    'bg-green-500 w-full'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength === 'weak' ? 'text-red-600' :
                passwordStrength === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {passwordStrength === 'weak' ? 'Fraca' :
                 passwordStrength === 'medium' ? 'Média' : 'Forte'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Mínimo 8 caracteres, com letras e números
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`pl-9 pr-9 ${fieldErrors.confirmPassword ? 'border-destructive' : 
              formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' : ''}`}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
            disabled={isLoading}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
            Eu aceito os{' '}
            <Link to="#" className="text-primary hover:underline">
              termos de uso
            </Link>{' '}
            e{' '}
            <Link to="#" className="text-primary hover:underline">
              política de privacidade
            </Link>
          </Label>
        </div>
        {fieldErrors.terms && (
          <p className="text-xs text-destructive">{fieldErrors.terms}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !acceptedTerms}
      >
        {isLoading ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Já tem uma conta? </span>
        <Link to="/login" className="text-primary hover:underline">
          Faça login
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;

