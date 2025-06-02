import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Clock, Users, ArrowLeft, Shuffle, Trophy, Play } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/Header';
import TeamsList from '@/components/TeamsList';
import PlayerCard from '@/components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState as useFormState } from 'react';

const MatchDetails = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { matches, confirmPresence, cancelPresence, sortTeams, recordMatchResult, currentUser } = useAppContext();
  
  const match = matches.find(m => m.id === matchId);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [teamAScore, setTeamAScore] = useFormState(0);
  const [teamBScore, setTeamBScore] = useFormState(0);
  
  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <p className="text-center py-20">Partida não encontrada.</p>
        </main>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };
  
  const isUserConfirmed = currentUser && match.confirmedPlayers.some(
    player => player.id === currentUser.id
  );
  
  const handleConfirmPresence = () => {
    if (matchId) confirmPresence(matchId);
  };
  
  const handleCancelPresence = () => {
    if (matchId) cancelPresence(matchId);
  };
  
  const handleSortTeams = () => {
    if (matchId) sortTeams(matchId);
  };
  
  const handleSaveResult = () => {
    if (matchId) recordMatchResult(matchId, teamAScore, teamBScore);
    setIsResultDialogOpen(false);
  };

  const handleStartLiveMatch = () => {
    navigate(`/live-match/${matchId}`);
  };
  
  const percentFilled = (match.confirmedPlayers.length / match.maxPlayers) * 100;
  // Permite iniciar com qualquer quantidade de jogadores (apenas precisa ter pelo menos 1)
  const hasAnyPlayers = match.confirmedPlayers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-16">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h1 className="text-xl font-semibold mb-4">{formattedDate(match.date)}</h1>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-emerald-500" />
              <span>{match.location}</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-emerald-500" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center">
              <Users size={18} className="mr-2 text-emerald-500" />
              <span>
                {match.confirmedPlayers.length} de {match.maxPlayers} jogadores
                {' '}
                ({match.maxPlayers - match.confirmedPlayers.length} vagas restantes)
              </span>
            </div>
          </div>
          
          <Progress value={percentFilled} className="h-2 mb-3" />
          
          {match.status === 'scheduled' && (
            <div className="flex flex-wrap gap-2 mt-4">
              {isUserConfirmed ? (
                <Button 
                  variant="outline" 
                  onClick={handleCancelPresence}
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                >
                  Cancelar presença
                </Button>
              ) : (
                <Button onClick={handleConfirmPresence}>
                  Confirmar presença
                </Button>
              )}
              
              {hasAnyPlayers && (
                <Button 
                  onClick={handleStartLiveMatch}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play size={16} />
                  <span>Iniciar Partida ao Vivo</span>
                </Button>
              )}
              
              {match.confirmedPlayers.length >= 4 && (
                <Button 
                  variant="outline" 
                  onClick={handleSortTeams}
                  className="flex items-center gap-1"
                >
                  <Shuffle size={16} />
                  <span>{match.teams ? "Sortear novamente" : "Sortear times"}</span>
                </Button>
              )}
              
              {match.teams && (
                <Button 
                  onClick={() => setIsResultDialogOpen(true)}
                  className="flex items-center gap-1 ml-auto"
                >
                  <Trophy size={16} />
                  <span>Registrar resultado</span>
                </Button>
              )}
            </div>
          )}

          {hasAnyPlayers && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium flex items-center gap-2">
                <Play size={16} />
                Partida pronta para modo ao vivo! ({match.confirmedPlayers.length} jogadores confirmados)
              </p>
            </div>
          )}
          
          {match.status === 'completed' && match.result && (
            <div className="text-center py-4">
              <div className="text-lg font-medium text-gray-700">Resultado final</div>
              <div className="text-2xl font-bold mt-1">
                Time A {match.result.teamAScore} x {match.result.teamBScore} Time B
              </div>
            </div>
          )}
        </div>
        
        {match.teams ? (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">Times</h2>
            <TeamsList 
              teamA={match.teams.teamA} 
              teamB={match.teams.teamB} 
              teamAScore={match.result?.teamAScore}
              teamBScore={match.result?.teamBScore}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Jogadores confirmados ({match.confirmedPlayers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {match.confirmedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            
            {match.confirmedPlayers.length === 0 && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="py-6 text-center text-gray-500">
                  Nenhum jogador confirmado ainda.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Resultado</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time A</Label>
                <Input 
                  type="number" 
                  min={0} 
                  value={teamAScore} 
                  onChange={(e) => setTeamAScore(parseInt(e.target.value, 10))} 
                />
              </div>
              
              <div>
                <Label>Time B</Label>
                <Input 
                  type="number" 
                  min={0} 
                  value={teamBScore} 
                  onChange={(e) => setTeamBScore(parseInt(e.target.value, 10))} 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResultDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveResult}>
              Salvar Resultado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchDetails;
