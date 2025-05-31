
import React, { useState } from 'react';
import { Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Team, LiveMatchEvent } from '@/types/liveMatch';

interface GoalAssistTrackerProps {
  teamA: Team;
  teamB: Team;
  onAddEvent: (event: Omit<LiveMatchEvent, 'id' | 'timestamp'>) => void;
  currentMinute: number;
  events: LiveMatchEvent[];
}

const GoalAssistTracker: React.FC<GoalAssistTrackerProps> = ({
  teamA,
  teamB,
  onAddEvent,
  currentMinute,
  events
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [eventType, setEventType] = useState<'goal' | 'assist'>('goal');

  const getCurrentTeam = () => {
    if (selectedTeam === teamA.id) return teamA;
    if (selectedTeam === teamB.id) return teamB;
    return null;
  };

  const handleAddEvent = () => {
    const team = getCurrentTeam();
    if (!team || !selectedPlayer) return;

    const player = team.players.find(p => p === selectedPlayer);
    if (!player) return;

    onAddEvent({
      type: eventType,
      playerId: selectedPlayer,
      playerName: selectedPlayer,
      teamId: team.id,
      minute: currentMinute
    });

    // Reset form
    setSelectedPlayer('');
  };

  const getTeamEvents = (teamId: string) => {
    return events.filter(event => event.teamId === teamId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registro de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Evento</label>
            <div className="flex gap-2">
              <Button
                variant={eventType === 'goal' ? 'default' : 'outline'}
                onClick={() => setEventType('goal')}
                className="flex items-center gap-2"
              >
                <Target size={16} />
                Gol
              </Button>
              <Button
                variant={eventType === 'assist' ? 'default' : 'outline'}
                onClick={() => setEventType('assist')}
                className="flex items-center gap-2"
              >
                <Users size={16} />
                Assistência
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={teamA.id}>{teamA.name}</SelectItem>
                <SelectItem value={teamB.id}>{teamB.name}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedTeam && (
            <div>
              <label className="block text-sm font-medium mb-2">Jogador</label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o jogador" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentTeam()?.players.map((player) => (
                    <SelectItem key={player} value={player}>
                      {player}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleAddEvent} 
            disabled={!selectedTeam || !selectedPlayer}
            className="w-full"
          >
            Registrar {eventType === 'goal' ? 'Gol' : 'Assistência'}
          </Button>
        </CardContent>
      </Card>

      {/* Eventos da Partida */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos da Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum evento registrado ainda
              </p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {event.type === 'goal' ? (
                      <Target size={16} className="text-green-600" />
                    ) : (
                      <Users size={16} className="text-blue-600" />
                    )}
                    <div>
                      <div className="font-medium">{event.playerName}</div>
                      <div className="text-sm text-gray-500">
                        {event.teamId === teamA.id ? teamA.name : teamB.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={event.type === 'goal' ? 'default' : 'secondary'}>
                      {event.type === 'goal' ? 'Gol' : 'Assist'}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.minute}'
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalAssistTracker;
