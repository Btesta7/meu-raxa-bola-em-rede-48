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

  if (!scheduledMatch || scheduledMatch.confirmedPlayers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Partida não encontrada ou sem jogadores
          </h2>
          <p className="text-gray-600 mb-6">
            Verifique se a partida existe e se há jogadores confirmados.
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

  const handleUndoEvent = (eventId: string) => {
    if (!currentMatch) return;

    const eventToUndo = currentMatch.events.find(e => e.id === eventId);
    if (!eventToUndo || eventToUndo.type !== 'goal') return;

    const newScore = { ...currentMatch.score };
    if (eventToUndo.teamId === currentMatch.teamA.id) {
      newScore.teamA = Math.max(0, newScore.teamA - 1);
    } else {
      newScore.teamB = Math.max(0, newScore.teamB - 1);
    }

    const updatedEvents = currentMatch.events.filter(e => e.id !== eventId);

    setCurrentMatch({
      ...currentMatch,
      score: newScore,
      events: updatedEvents,
      winner: null // Reset winner when undoing goal
    });
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

  const handleStartNextMatch = () => {
    setPhase('match-selection');
  };

  const handleBackToSelection = () => {
    setPhase('match-selection');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleTimerStart = () => {
    if (!currentMatch) return;
    setCurrentMatch({
      ...currentMatch,
      timer: { ...currentMatch.timer, isRunning: true, isPaused: false }
    });
  };

  const handleTimerPause = () => {
    if (!currentMatch) return;
    setCurrentMatch({
      ...currentMatch,
      timer: { ...currentMatch.timer, isRunning: false, isPaused: true }
    });
  };

  const handleTimerReset = () => {
    if (!currentMatch) return;
    setCurrentMatch({
      ...currentMatch,
      timer: { seconds: 420, isRunning: false, isPaused: false }
    });
  };

  const handleTimerTick = () => {
    if (!currentMatch) return;
    const newSeconds = Math.max(0, currentMatch.timer.seconds - 1);
    setCurrentMatch({
      ...currentMatch,
      timer: { ...currentMatch.timer, seconds: newSeconds }
    });

    if (newSeconds === 0 && !currentMatch.winner) {
      setPhase('match-ended');
    }
  };

  // Converter jogadores confirmados para o formato necessário
  const confirmedPlayersAsLiveMatchPlayers: Player[] = scheduledMatch.confirmedPlayers.map(player => ({
    id: player.id,
    name: player.name,
    skillLevel: 3 // Valor padrão, pode ser ajustado baseado nos stats do jogador
  }));

  // Preparar próxima partida
  const getNextMatch = () => {
    if (teams.length < 3 || !currentMatch) return null;
    
    const otherTeams = teams.filter(t => t.id !== currentMatch.teamA.id && t.id !== currentMatch.teamB.id);
    if (otherTeams.length === 0) return null;

    return {
      teamA: currentMatch.waitingTeam,
      teamB: otherTeams[0],
      waitingTeam: currentMatch.winner || currentMatch.teamA
    };
  };

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
              seconds={currentMatch.timer.seconds}
              isRunning={currentMatch.timer.isRunning}
              isPaused={currentMatch.timer.isPaused}
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onReset={handleTimerReset}
              onTick={handleTimerTick}
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

            <EventHistory 
              events={currentMatch.events}
              onUndoEvent={handleUndoEvent}
            />
          </div>
        </div>
      )}

      {phase === 'match-ended' && currentMatch && (
        <MatchEnd
          completedMatch={{
            id: `match-${Date.now()}`,
            teamA: currentMatch.teamA,
            teamB: currentMatch.teamB,
            finalScore: currentMatch.score,
            winner: currentMatch.winner!,
            events: currentMatch.events,
            duration: 420 - currentMatch.timer.seconds,
            timestamp: new Date()
          }}
          nextMatch={getNextMatch()}
          onStartNextMatch={handleStartNextMatch}
          onBackToSelection={handleBackToSelection}
        />
      )}
    </div>
  );
};
