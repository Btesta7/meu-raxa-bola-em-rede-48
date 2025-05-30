
import React, { useState, useRef } from 'react';
import { User } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Camera, Upload } from 'lucide-react';

interface AvatarUploaderProps {
  user: User;
  isEditing: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ user, isEditing }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('O arquivo deve ter no máximo 2MB');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simular upload
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Avatar atualizado com sucesso!');
      // Aqui seria feita a atualização real do avatar
    }, 1500);
  };

  const handleClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 cursor-pointer" onClick={handleClick}>
          <AvatarImage 
            src={preview || user.avatar} 
            alt={user.name} 
            className={isUploading ? 'opacity-50' : ''}
          />
          <AvatarFallback className="text-xl">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            onClick={handleClick}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-medium">Foto do Perfil</h4>
        <p className="text-sm text-gray-600 mb-3">
          {isEditing 
            ? 'Clique na foto ou no botão para fazer upload de uma nova imagem'
            : 'Sua foto atual do perfil'
          }
        </p>
        
        {isEditing && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={isUploading}
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? 'Fazendo upload...' : 'Escolher Nova Foto'}
            </Button>
            
            <p className="text-xs text-gray-500">
              Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUploader;
