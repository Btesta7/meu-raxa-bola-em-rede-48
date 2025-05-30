
import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Check, X } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
}

const positionColors = {
  "Goleiro": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Defensor": "bg-blue-100 text-blue-800 border-blue-200",
  "Meio-campista": "bg-green-100 text-green-800 border-green-200",
  "Atacante": "bg-red-100 text-red-800 border-red-200"
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  onEditToggle
}) => {
  const positionClasses = positionColors[user.position] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xl">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={positionClasses}>
                {user.position}
              </Badge>
              {user.isAdmin && (
                <Badge variant="default">
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button onClick={onEditToggle} className="flex items-center gap-2">
              <Edit size={16} />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Modo de edição ativo</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats resumo */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.goals}</div>
          <div className="text-sm text-gray-600">Gols</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.assists}</div>
          <div className="text-sm text-gray-600">Assistências</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.matches}</div>
          <div className="text-sm text-gray-600">Partidas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{user.stats.wins}</div>
          <div className="text-sm text-gray-600">Vitórias</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
