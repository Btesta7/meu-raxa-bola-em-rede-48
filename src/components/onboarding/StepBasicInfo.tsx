
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/types';
import { ArrowRight } from 'lucide-react';

interface StepBasicInfoProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, onUpdate, onNext }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!data.age || data.age < 16 || data.age > 60) {
      newErrors.age = 'Idade deve estar entre 16 e 60 anos';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) {
      newErrors.phone = 'Formato de telefone inválido (ex: (11) 99999-9999)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      const formatted = numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      return formatted;
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onUpdate({ phone: formatted });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <p className="text-gray-600">
          Vamos começar com suas informações pessoais básicas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Digite seu nome completo"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="age">Idade *</Label>
          <Input
            id="age"
            type="number"
            min="16"
            max="60"
            value={data.age || ''}
            onChange={(e) => onUpdate({ age: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="Sua idade"
            className={errors.age ? 'border-red-500' : ''}
          />
          {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={validateAndNext} className="flex items-center gap-2">
            Próximo
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepBasicInfo;
