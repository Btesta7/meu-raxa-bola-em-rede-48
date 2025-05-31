
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TeamDraw } from './TeamDraw';
import { MatchSelection } from './MatchSelection';
import { GoalTracker } from './GoalTracker';
import { MatchTimer } from './MatchTimer';
import { RealisticScoreboard } from './RealisticScoreboard';
import { EventHistory } from './EventHistory';
import { MatchEnd } from './MatchEnd';
import { Team, Player, MatchEvent, MatchSession, CompletedMatch } from '@/types/liveMatch';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const LiveMatchFlow = () => {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const { matches } = useAppContext();
  
  const scheduledMatch = matches.find(m => m.id === matchId);
  
  // Estados do fluxo da partida ao vivo
  const [phase, setPhase] = useState<'team-draw' | 'match-selection' | 'live-match' | 'match-ended'>('team-draw');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentMatch, setCurrentMatch] = useState<{
    teamA: Team;
    teamB: Team;
    waitingTeam: Team;
    score: { teamA: number; teamB: number };
    events: MatchEvent[];
    timer: { seconds: number; isRunning: boolean; isPaused: boolean };
    winner: Team | null;
  } | null>(null);
  const [matchHistory, setMatchHistory] = useState<CompletedMatch[]>([]);
  const [pendingAssist, setPendingAssist] = useState<{
    goalEvent: MatchEvent | null;
    isWaiting: boolean;
  }>({ goalEvent: null, isWaiting: false });

  if (!scheduledMatch || scheduledMatch.confirmedPlayers.length < 15) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Partida não disponível para modo ao vivo
          </h2>
          <p className="text-gray-600 mb-6">
            É necessário ter 15 jogadores confirmados para iniciar a partida ao vivo.
          </p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  const handleTeamsGenerated = (generatedTeams: Team[]) => {
    setTeams(generatedTeams);
    setPhase('match-selection');
  };

  const handleMatchStart = (teamA: Team, teamB: Team, waitingTeam: Team) => {
    setCurrentMatch({
      teamA,
      teamB,
      waitingTeam,
      score: { teamA: 0, teamB: 0 },
      events: [],
      timer: { seconds: 420, isRunning: false, isPaused: false }, // 7 minutos
      winner: null
    });
    setPhase('live-match');
  };

  const handleGoalScored = (player: Player, team: Team) => {
    if (!currentMatch) return;

    const goalEvent: MatchEvent = {
      id: `goal-${Date.now()}`,
      type: 'goal',
      playerId: player.id,
      playerName: player.name,
      team: team.name,
      teamId: team.id,
      minute: Math.ceil((420 - currentMatch.timer.seconds) / 60).toString(),
      timestamp: new Date()
    };

    const newScore = { ...currentMatch.score };
    if (team.id === currentMatch.teamA.id) {
      newScore.teamA += 1;
    } else {
      newScore.teamB += 1;
    }

    const winner = newScore.teamA >= 2 ? currentMatch.teamA :
                   newScore.teamB >= 2 ? currentMatch.teamB : null;

    setCurrentMatch({
      ...currentMatch,
      score: newScore,
      events: [...currentMatch.events, goalEvent],
      winner
    });

    setPendingAssist({ goalEvent, isWaiting: true });

    if (winner) {
      setPhase('match-ended');
    }
  };

  const handleAssistAdded = (assistPlayer: Player | null) => {
    if (!pendingAssist.goalEvent || !currentMatch) return;

    const updatedEvents = currentMatch.events.map(event => {
      if (event.id === pendingAssist.goalEvent!.id && assistPlayer) {
        return {
          ...event,
          assistPlayerId: assistPlayer.id,
          assistPlayerName: assistPlayer.name
        };
      }
      return event;
    });

    setCurrentMatch({
      ...currentMatch,
      events: updatedEvents
    });

    setPendingAssist({ goalEvent: null, isWaiting: false });
  };

  const handleMatchEnd = () => {
    if (!currentMatch) return;

    const completedMatch: CompletedMatch = {
      id: `match-${Date.now()}`,
      teamA: currentMatch.teamA,
      teamB: currentMatch.teamB,
      finalScore: currentMatch.score,
      winner: currentMatch.winner!,
      events: currentMatch.events,
      duration: 420 - currentMatch.timer.seconds,
      timestamp: new Date()
    };

    setMatchHistory([...matchHistory, completedMatch]);
    setCurrentMatch(null);
    setPhase('team-draw');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Converter jogadores confirmados para o formato necessário
  const confirmedPlayersAsLiveMatchPlayers: Player[] = scheduledMatch.confirmedPlayers.map(player => ({
    id: player.id,
    name: player.name,
    skillLevel: 3 // Valor padrão, pode ser ajustado baseado nos stats do jogador
  }));

  return (
    <div className="min-h-screen">
      {phase === 'team-draw' && (
        <TeamDraw
          confirmedPlayers={confirmedPlayersAsLiveMatchPlayers}
          onTeamsGenerated={handleTeamsGenerated}
        />
      )}

      {phase === 'match-selection' && (
        <MatchSelection
          teams={teams}
          onMatchStart={handleMatchStart}
        />
      )}

      {phase === 'live-match' && currentMatch && (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Home
              </Button>
              
              <div className="text-white text-lg font-semibold">
                Partida de {scheduledMatch.date}
              </div>
            </div>

            <RealisticScoreboard
              teamA={currentMatch.teamA}
              teamB={currentMatch.teamB}
              scoreA={currentMatch.score.teamA}
              scoreB={currentMatch.score.teamB}
              timer={currentMatch.timer}
              winner={currentMatch.winner}
            />

            <MatchTimer
              timer={currentMatch.timer}
              onTimerUpdate={(newTimer) => {
                if (currentMatch) {
                  setCurrentMatch({ ...currentMatch, timer: newTimer });
                  if (newTimer.seconds === 0 && !currentMatch.winner) {
                    setPhase('match-ended');
                  }
                }
              }}
            />

            <GoalTracker
              teamA={currentMatch.teamA}
              teamB={currentMatch.teamB}
              onGoalScored={handleGoalScored}
              pendingAssist={pendingAssist}
              onAssistAdded={handleAssistAdded}
              scoreA={currentMatch.score.teamA}
              scoreB={currentMatch.score.teamB}
              winner={currentMatch.winner}
            />

            <EventHistory events={currentMatch.events} />
          </div>
        </div>
      )}

      {phase === 'match-ended' && currentMatch && (
        <MatchEnd
          teamA={currentMatch.teamA}
          teamB={currentMatch.teamB}
          finalScore={currentMatch.score}
          winner={currentMatch.winner!}
          events={currentMatch.events}
          onNewMatch={() => setPhase('match-selection')}
          onEndSession={handleBackToHome}
        />
      )}
    </div>
  );
};
