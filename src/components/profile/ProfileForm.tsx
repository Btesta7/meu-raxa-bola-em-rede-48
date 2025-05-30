
import React, { useState, useEffect } from 'react';
import { User, ProfileFormData, PlayerPosition } from '@/types';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Save, X } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

interface ProfileFormProps {
  user: User;
  isEditing: boolean;
  onEditComplete: () => void;
}

const positions: PlayerPosition[] = ["Goleiro", "Defensor", "Meio-campista", "Atacante"];
const relationships = ["Pai", "Mãe", "Cônjuge", "Irmão/Irmã", "Filho/Filha", "Amigo", "Outro"];

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  isEditing,
  onEditComplete
}) => {
  const { updateUserProfile } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    age: user.age || null,
    bio: user.bio || '',
    position: user.position,
    secondaryPositions: user.secondaryPositions || [],
    preferredFoot: user.preferredFoot || 'right',
    yearsPlaying: user.yearsPlaying || null,
    emergencyContact: user.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    },
    preferences: user.preferences || {
      notifications: true,
      privacy: 'public'
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      onEditComplete();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      age: user.age || null,
      bio: user.bio || '',
      position: user.position,
      secondaryPositions: user.secondaryPositions || [],
      preferredFoot: user.preferredFoot || 'right',
      yearsPlaying: user.yearsPlaying || null,
      emergencyContact: user.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      preferences: user.preferences || {
        notifications: true,
        privacy: 'public'
      }
    });
    onEditComplete();
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foto do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUploader user={user} isEditing={isEditing} />
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              ) : (
                <p className="py-2">{user.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              ) : (
                <p className="py-2">{user.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <p className="py-2">{user.phone || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Idade</Label>
              {isEditing ? (
                <Input
                  id="age"
                  type="number"
                  min="16"
                  max="60"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Sua idade"
                />
              ) : (
                <p className="py-2">{user.age || 'Não informado'}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Biografia</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte um pouco sobre você..."
                rows={3}
                maxLength={500}
              />
            ) : (
              <p className="py-2">{user.bio || 'Nenhuma biografia adicionada'}</p>
            )}
            {isEditing && (
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/500 caracteres
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Football Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Futebol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Posição Principal *</Label>
              {isEditing ? (
                <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger>
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
              ) : (
                <p className="py-2">{user.position}</p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredFoot">Pé Preferido</Label>
              {isEditing ? (
                <Select value={formData.preferredFoot} onValueChange={(value) => handleInputChange('preferredFoot', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu pé preferido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Direito</SelectItem>
                    <SelectItem value="left">Esquerdo</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="py-2">
                  {user.preferredFoot === 'right' ? 'Direito' : 
                   user.preferredFoot === 'left' ? 'Esquerdo' : 
                   user.preferredFoot === 'both' ? 'Ambos' : 'Não informado'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="yearsPlaying">Anos Jogando Futebol</Label>
              {isEditing ? (
                <Input
                  id="yearsPlaying"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsPlaying || ''}
                  onChange={(e) => handleInputChange('yearsPlaying', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Quantos anos jogando"
                />
              ) : (
                <p className="py-2">{user.yearsPlaying || 'Não informado'} anos</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contato de Emergência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyName">Nome do Contato</Label>
              {isEditing ? (
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  placeholder="Nome completo"
                />
              ) : (
                <p className="py-2">{user.emergencyContact?.name || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <p className="py-2">{user.emergencyContact?.phone || 'Não informado'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="emergencyRelationship">Relação</Label>
              {isEditing ? (
                <Select 
                  value={formData.emergencyContact.relationship} 
                  onValueChange={(value) => handleEmergencyContactChange('relationship', value)}
                >
                  <SelectTrigger>
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
              ) : (
                <p className="py-2">{user.emergencyContact?.relationship || 'Não informado'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X size={16} className="mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save size={16} className="mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
