
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatchSchedule } from '@/types/admin';
import { useAdminContext } from '@/contexts/AdminContext';
import { useUserContext } from '@/contexts/UserContext';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface ScheduledMatchCardProps {
  match: MatchSchedule;
}

const ScheduledMatchCard: React.FC<ScheduledMatchCardProps> = ({ match }) => {
  const { confirmPlayerAttendance, cancelPlayerAttendance } = useAdminContext();
  const { user } = useUserContext();

  if (!user) return null;

  const isConfirmed = match.confirmedPlayers.includes(user.id);
  const isInWaitingList = match.waitingList.includes(user.id);
  const isFull = match.confirmedPlayers.length >= match.maxPlayers;
  const canConfirm = !isConfirmed && !isInWaitingList;

  const handleConfirmPresence = () => {
    confirmPlayerAttendance(match.id, user.id);
  };

  const handleCancelPresence = () => {
    cancelPlayerAttendance(match.id, user.id);
  };

  const getStatusBadge = () => {
    if (isConfirmed) return <Badge className="bg-green-500">Confirmado</Badge>;
    if (isInWaitingList) return <Badge className="bg-yellow-500">Lista de Espera</Badge>;
    if (isFull) return <Badge variant="destructive">Lotada</Badge>;
    return <Badge variant="outline">Disponível</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{match.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(match.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{match.confirmedPlayers.length}/{match.maxPlayers}</span>
          </div>
        </div>

        {match.description && (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {match.description}
          </p>
        )}

        {match.waitingList.length > 0 && (
          <p className="text-sm text-amber-600">
            ⏳ {match.waitingList.length} pessoa(s) na lista de espera
          </p>
        )}

        <div className="flex gap-2">
          {isConfirmed ? (
            <Button
              variant="outline"
              onClick={handleCancelPresence}
              className="flex-1"
            >
              Cancelar Presença
            </Button>
          ) : isInWaitingList ? (
            <Button
              variant="outline"
              onClick={handleCancelPresence}
              className="flex-1"
            >
              Sair da Lista de Espera
            </Button>
          ) : (
            <Button
              onClick={handleConfirmPresence}
              className="flex-1"
              disabled={match.status !== 'active'}
            >
              {isFull ? 'Entrar na Lista de Espera' : 'Confirmar Presença'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledMatchCard;
