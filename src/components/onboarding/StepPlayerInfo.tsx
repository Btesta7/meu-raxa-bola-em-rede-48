
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData, PlayerPosition } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepPlayerInfoProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const positions: PlayerPosition[] = ["Goleiro", "Defensor", "Meio-campista", "Atacante"];

const StepPlayerInfo: React.FC<StepPlayerInfoProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.position) {
      newErrors.position = 'Posição principal é obrigatória';
    }

    if (!data.preferredFoot) {
      newErrors.preferredFoot = 'Pé preferido é obrigatório';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Jogador</CardTitle>
        <p className="text-gray-600">
          Agora vamos conhecer mais sobre seu perfil como jogador
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="position">Posição Principal *</Label>
          <Select value={data.position} onValueChange={(value) => onUpdate({ position: value as PlayerPosition })}>
            <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione sua posição" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
        </div>

        <div>
          <Label htmlFor="preferredFoot">Pé Preferido *</Label>
          <Select value={data.preferredFoot} onValueChange={(value) => onUpdate({ preferredFoot: value as 'right' | 'left' | 'both' })}>
            <SelectTrigger className={errors.preferredFoot ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione seu pé preferido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">Direito</SelectItem>
              <SelectItem value="left">Esquerdo</SelectItem>
              <SelectItem value="both">Ambos</SelectItem>
            </SelectContent>
          </Select>
          {errors.preferredFoot && <p className="text-sm text-red-500 mt-1">{errors.preferredFoot}</p>}
        </div>

        <div>
          <Label htmlFor="yearsPlaying">Anos Jogando Futebol</Label>
          <Input
            id="yearsPlaying"
            type="number"
            min="0"
            max="50"
            value={data.yearsPlaying || ''}
            onChange={(e) => onUpdate({ yearsPlaying: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="Quantos anos jogando (opcional)"
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Anterior
          </Button>
          <Button onClick={validateAndNext} className="flex items-center gap-2">
            Próximo
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPlayerInfo;
