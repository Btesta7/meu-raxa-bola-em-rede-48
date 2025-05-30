
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { OnboardingData } from '@/types';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';

interface StepAvatarBioProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StepAvatarBio: React.FC<StepAvatarBioProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onUpdate({ avatar: file });
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar e Biografia</CardTitle>
        <p className="text-gray-600">
          Adicione uma foto e conte um pouco sobre você (opcional)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={handleClick}>
              <AvatarImage 
                src={preview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`} 
                alt={data.name} 
              />
              <AvatarFallback className="text-xl">
                {data.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <h4 className="font-medium mb-2">Foto do Perfil</h4>
            <p className="text-sm text-gray-600 mb-3">
              Clique na foto ou no botão para fazer upload de uma nova imagem
            </p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
            >
              <Upload size={16} className="mr-2" />
              Escolher Foto
            </Button>
            
            <p className="text-xs text-gray-500 mt-2">
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            placeholder="Conte um pouco sobre você, sua experiência com futebol, objetivos..."
            rows={4}
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {data.bio.length}/500 caracteres
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Anterior
          </Button>
          <Button onClick={onNext} className="flex items-center gap-2">
            Próximo
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepAvatarBio;
