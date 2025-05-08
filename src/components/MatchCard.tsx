
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Clock, Users, ChevronRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/contexts/AppContext';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const formattedDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "EEE, dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const percentFilled = (match.confirmedPlayers.length / match.maxPlayers) * 100;
  
  const isUserConfirmed = currentUser && match.confirmedPlayers.some(
    player => player.id === currentUser.id
  );

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/match/${match.id}`)}
    >
      <div className={`h-2 ${match.status === 'completed' ? 'bg-gray-400' : match.status === 'canceled' ? 'bg-red-500' : 'bg-emerald-500'}`} />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg">{formattedDate(match.date)}</h3>
          {match.status === 'completed' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy size={12} />
              Finalizada
            </Badge>
          )}
          {match.status === 'canceled' && (
            <Badge variant="destructive" className="flex items-center gap-1">
              Cancelada
            </Badge>
          )}
          {match.status === 'scheduled' && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Agendada
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-emerald-500" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-emerald-500" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-emerald-500" />
            <span className="flex-1">
              {match.confirmedPlayers.length} de {match.maxPlayers} jogadores
            </span>
          </div>
        </div>

        <Progress value={percentFilled} className="h-2 mb-3" />

        <div className="flex justify-between items-center">
          {isUserConfirmed ? (
            <span className="text-xs text-emerald-600 font-medium">Você está confirmado</span>
          ) : (
            <span className="text-xs text-gray-500">
              {match.maxPlayers - match.confirmedPlayers.length} vagas restantes
            </span>
          )}
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
