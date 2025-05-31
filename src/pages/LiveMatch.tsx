
import { useState, useCallback, useEffect } from "react";
import { TeamSelection } from "@/components/live-match/TeamSelection";
import { MatchTimer } from "@/components/live-match/MatchTimer";
import { Scoreboard } from "@/components/live-match/Scoreboard";
import { GoalTracker } from "@/components/live-match/GoalTracker";
import { EventHistory } from "@/components/live-match/EventHistory";
import { MatchState, Team, Player, MatchEvent } from "@/types/liveMatch";
import { toast } from "sonner";

const INITIAL_STATE: MatchState = {
  teamA: null,
  teamB: null,
  score: { teamA: 0, teamB: 0 },
  timer: { seconds: 420, isRunning: false, isPaused: false }, // 7 minutes
  events: [],
  isMatchStarted: false,
  pendingAssist: { goalEvent: null, isWaiting: false }
};

const STORAGE_KEY = 'nosso-racha-match-state';

export default function LiveMatch() {
  const [matchState, setMatchState] = useState<MatchState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
  }, [matchState]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!matchState.isMatchStarted) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (matchState.timer.isRunning) {
            handlePause();
          } else {
            handleStart();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [matchState]);

  const handleTeamASelect = (team: Team) => {
    setMatchState(prev => ({ ...prev, teamA: team }));
  };

  const handleTeamBSelect = (team: Team) => {
    setMatchState(prev => ({ ...prev, teamB: team }));
  };

  const handleStartMatch = () => {
    if (!matchState.teamA || !matchState.teamB) return;
    
    setMatchState(prev => ({ ...prev, isMatchStarted: true }));
    toast.success(`Partida iniciada: ${matchState.teamA!.name} vs ${matchState.teamB!.name}`);
  };

  const handleStart = () => {
    setMatchState(prev => ({
      ...prev,
      timer: { ...prev.timer, isRunning: true, isPaused: false }
    }));
  };

  const handlePause = () => {
    setMatchState(prev => ({
      ...prev,
      timer: { ...prev.timer, isRunning: false, isPaused: true }
    }));
  };

  const handleReset = () => {
    setMatchState(prev => ({
      ...prev,
      timer: { seconds: 420, isRunning: false, isPaused: false }
    }));
  };

  const handleTick = useCallback(() => {
    setMatchState(prev => {
      if (prev.timer.seconds <= 1) {
        toast.error("TEMPO ESGOTADO! ⏰", {
          duration: 5000,
        });
        return {
          ...prev,
          timer: { seconds: 0, isRunning: false, isPaused: false }
        };
      }
      return {
        ...prev,
        timer: { ...prev.timer, seconds: prev.timer.seconds - 1 }
      };
    });
  }, []);

  const formatTimeForEvent = (seconds: number) => {
    const totalMinutes = 7;
    const elapsedSeconds = (totalMinutes * 60) - seconds;
    const minutes = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGoalScored = (player: Player, team: Team) => {
    const eventId = `goal-${Date.now()}-${Math.random()}`;
    const goalEvent: MatchEvent = {
      id: eventId,
      type: 'goal',
      playerId: player.id,
      playerName: player.name,
      team: team.name,
      teamId: team.id,
      minute: formatTimeForEvent(matchState.timer.seconds),
      timestamp: new Date()
    };

    setMatchState(prev => ({
      ...prev,
      score: {
        ...prev.score,
        [team.id === prev.teamA?.id ? 'teamA' : 'teamB']: prev.score[team.id === prev.teamA?.id ? 'teamA' : 'teamB'] + 1
      },
      events: [...prev.events, goalEvent],
      pendingAssist: { goalEvent, isWaiting: true }
    }));

    toast.success(`⚽ GOL! ${player.name} (${team.name})`);
  };

  const handleAssistAdded = (assistPlayer: Player | null) => {
    if (!matchState.pendingAssist.goalEvent) return;

    const updatedEvent: MatchEvent = {
      ...matchState.pendingAssist.goalEvent,
      assistPlayerId: assistPlayer?.id,
      assistPlayerName: assistPlayer?.name
    };

    setMatchState(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ),
      pendingAssist: { goalEvent: null, isWaiting: false }
    }));

    if (assistPlayer) {
      toast.success(`👏 Assistência de ${assistPlayer.name}!`);
    }
  };

  const handleUndoEvent = (eventId: string) => {
    const event = matchState.events.find(e => e.id === eventId);
    if (!event) return;

    setMatchState(prev => {
      const newEvents = prev.events.filter(e => e.id !== eventId);
      const teamKey = event.teamId === prev.teamA?.id ? 'teamA' : 'teamB';
      
      return {
        ...prev,
        events: newEvents,
        score: {
          ...prev.score,
          [teamKey]: Math.max(0, prev.score[teamKey] - 1)
        },
        pendingAssist: prev.pendingAssist.goalEvent?.id === eventId 
          ? { goalEvent: null, isWaiting: false }
          : prev.pendingAssist
      };
    });

    toast.info(`Evento desfeito: ${event.playerName}`);
  };

  if (!matchState.isMatchStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <TeamSelection
            teamA={matchState.teamA}
            teamB={matchState.teamB}
            onTeamASelect={handleTeamASelect}
            onTeamBSelect={handleTeamBSelect}
            onStartMatch={handleStartMatch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Placar */}
        <Scoreboard
          teamA={matchState.teamA!}
          teamB={matchState.teamB!}
          scoreA={matchState.score.teamA}
          scoreB={matchState.score.teamB}
        />

        {/* Cronômetro */}
        <MatchTimer
          seconds={matchState.timer.seconds}
          isRunning={matchState.timer.isRunning}
          isPaused={matchState.timer.isPaused}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onTick={handleTick}
        />

        {/* Marcação de Gols */}
        <GoalTracker
          teamA={matchState.teamA!}
          teamB={matchState.teamB!}
          onGoalScored={handleGoalScored}
          pendingAssist={matchState.pendingAssist}
          onAssistAdded={handleAssistAdded}
        />

        {/* Histórico de Eventos */}
        <EventHistory
          events={matchState.events}
          onUndoEvent={handleUndoEvent}
        />
      </div>
    </div>
  );
}
