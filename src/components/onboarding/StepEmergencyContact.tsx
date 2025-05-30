
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/types';
import { ArrowLeft, Check } from 'lucide-react';

interface StepEmergencyContactProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const relationships = ["Pai", "Mãe", "Cônjuge", "Irmão/Irmã", "Filho/Filha", "Amigo", "Outro"];

const StepEmergencyContact: React.FC<StepEmergencyContactProps> = ({ 
  data, 
  onUpdate, 
  onComplete, 
  onPrevious, 
  isSubmitting 
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndComplete = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.emergencyContact.name.trim()) {
      newErrors.name = 'Nome do contato é obrigatório';
    }

    if (!data.emergencyContact.phone.trim()) {
      newErrors.phone = 'Telefone do contato é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.emergencyContact.phone)) {
      newErrors.phone = 'Formato de telefone inválido (ex: (11) 99999-9999)';
    }

    if (!data.emergencyContact.relationship) {
      newErrors.relationship = 'Relação é obrigatória';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onComplete();
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
    onUpdate({ 
      emergencyContact: { 
        ...data.emergencyContact, 
        phone: formatted 
      } 
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ 
      emergencyContact: { 
        ...data.emergencyContact, 
        name: e.target.value 
      } 
    });
  };

  const handleRelationshipChange = (value: string) => {
    onUpdate({ 
      emergencyContact: { 
        ...data.emergencyContact, 
        relationship: value 
      } 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contato de Emergência</CardTitle>
        <p className="text-gray-600">
          Para sua segurança, precisamos de um contato de emergência
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="emergencyName">Nome do Contato *</Label>
          <Input
            id="emergencyName"
            value={data.emergencyContact.name}
            onChange={handleNameChange}
            placeholder="Nome completo do contato"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="emergencyPhone">Telefone do Contato *</Label>
          <Input
            id="emergencyPhone"
            value={data.emergencyContact.phone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="emergencyRelationship">Relação *</Label>
          <Select 
            value={data.emergencyContact.relationship} 
            onValueChange={handleRelationshipChange}
          >
            <SelectTrigger className={errors.relationship ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione a relação" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.relationship && <p className="text-sm text-red-500 mt-1">{errors.relationship}</p>}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Quase terminando! 🎉</h4>
          <p className="text-sm text-green-700">
            Após finalizar, você terá acesso completo ao Meu Raxa e poderá participar de todas as funcionalidades.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} disabled={isSubmitting} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Anterior
          </Button>
          <Button 
            onClick={validateAndComplete} 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Check size={16} />
            {isSubmitting ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepEmergencyContact;
