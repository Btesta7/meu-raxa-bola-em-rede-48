
import React from 'react';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  player: User;
  onClick?: () => void;
  showStats?: boolean;
}

const positionColors = {
  "Goleiro": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Defensor": "bg-blue-100 text-blue-800 border-blue-200",
  "Meio-campista": "bg-green-100 text-green-800 border-green-200",
  "Atacante": "bg-red-100 text-red-800 border-red-200"
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick, showStats = false }) => {
  const positionClasses = positionColors[player.position] || "bg-gray-100 text-gray-800 border-gray-200";
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-medium text-base">{player.name}</h3>
            <Badge variant="outline" className={`font-normal mt-1 ${positionClasses}`}>
              {player.position}
            </Badge>
          </div>
        </div>
        
        {showStats && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 rounded p-2">
              <div className="font-semibold text-emerald-600">{player.stats.goals}</div>
              <div className="text-xs text-gray-500">Gols</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-semibold text-emerald-600">{player.stats.matches}</div>
              <div className="text-xs text-gray-500">Jogos</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-semibold text-emerald-600">{player.stats.wins}</div>
              <div className="text-xs text-gray-500">Vitórias</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
