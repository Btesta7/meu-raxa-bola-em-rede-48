import { useState, useCallback, useEffect } from "react";
import { TeamDraw } from "@/components/live-match/TeamDraw";
import { MatchSelection } from "@/components/live-match/MatchSelection";
import { MatchTimer } from "@/components/live-match/MatchTimer";
import { RealisticScoreboard } from "@/components/live-match/RealisticScoreboard";
import { GoalTracker } from "@/components/live-match/GoalTracker";
import { EventHistory } from "@/components/live-match/EventHistory";
import { MatchEnd } from "@/components/live-match/MatchEnd";
import { MatchState, Team, Player, MatchEvent, CompletedMatch, DEMO_PLAYERS, canStartMatch } from "@/types/liveMatch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { useMatchContext } from "@/contexts/MatchContext";

const INITIAL_STATE: MatchState = {
  phase: 'setup',
  session: {
    id: `session-${Date.now()}`,
    confirmedPlayers: DEMO_PLAYERS,
    teams: [],
    currentMatch: null,
    matchHistory: []
  }
};

const STORAGE_KEY = 'nosso-racha-complete-session';

export default function LiveMatch() {
  const { user } = useUserContext();
  const { matches } = useMatchContext();
  
  const [matchState, setMatchState] = useState<MatchState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Atualizar jogadores confirmados se houver partidas disponíveis
  useEffect(() => {
    if (matches && matches.length > 0) {
      // Encontrar partida com mais jogadores confirmados
      const matchWithMostPlayers = [...matches].sort((a, b) => 
        (Array.isArray(b.confirmedPlayers) ? b.confirmedPlayers.length : 0) - 
        (Array.isArray(a.confirmedPlayers) ? a.confirmedPlayers.length : 0)
      )[0];
      
      if (matchWithMostPlayers && Array.isArray(matchWithMostPlayers.confirmedPlayers)) {
        // Converter para o formato Player necessário para o componente
        const players: Player[] = matchWithMostPlayers.confirmedPlayers.map(p => {
          if (typeof p === 'string') {
            return { id: p, name: `Jogador ${p}` };
          } else {
            return { 
              id: p.id, 
              name: p.name,
              position: p.position,
              skillLevel: 3 // Valor padrão
            };
          }
        });
        
        if (players.length > 0) {
          setMatchState(prev => ({
            ...prev,
            session: {
              ...prev.session,
              confirmedPlayers: players
            }
          }));
          
          toast.info(`${players.length} jogadores carregados da partida selecionada`);
        }
      }
    }
  }, [matches]);

  const [pendingAssist, setPendingAssist] = useState<{
    goalEvent: MatchEvent | null;
    isWaiting: boolean;
  }>({
    goalEvent: null,
    isWaiting: false
  });

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
  }, [matchState]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (matchState.phase !== 'live-match' || !matchState.session.currentMatch) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (matchState.session.currentMatch.timer.isRunning) {
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

  // Handlers do sorteio
  const handleTeamsGenerated = (teams: Team[]) => {
    setMatchState(prev => ({
      ...prev,
      phase: 'team-selection',
      session: {
        ...prev.session,
        teams
      }
    }));
    toast.success("Times sorteados com sucesso!");
  };

  // Handlers da seleção de partida
  const handleMatchStart = (teamA: Team, teamB: Team, waitingTeam: Team) => {
    setMatchState(prev => ({
      ...prev,
      phase: 'live-match',
      session: {
        ...prev.session,
        currentMatch: {
          teamA,
          teamB,
          waitingTeam,
          score: { teamA: 0, teamB: 0 },
          events: [],
          timer: { seconds: 420, isRunning: false, isPaused: false },
          winner: null
        }
      }
    }));
    toast.success(`Partida iniciada: ${teamA.name} vs ${teamB.name}`);
  };

  // Handlers do cronômetro
  const handleStart = () => {
    setMatchState(prev => ({
      ...prev,
      session: {
        ...prev.session,
        currentMatch: prev.session.currentMatch ? {
          ...prev.session.currentMatch,
          timer: { ...prev.session.currentMatch.timer, isRunning: true, isPaused: false }
        } : null
      }
    }));
  };

  const handlePause = () => {
    setMatchState(prev => ({
      ...prev,
      session: {
        ...prev.session,
        currentMatch: prev.session.currentMatch ? {
          ...prev.session.currentMatch,
          timer: { ...prev.session.currentMatch.timer, isRunning: false, isPaused: true }
        } : null
      }
    }));
  };

  const handleReset = () => {
    setMatchState(prev => ({
      ...prev,
      session: {
        ...prev.session,
        currentMatch: prev.session.currentMatch ? {
          ...prev.session.currentMatch,
          timer: { seconds: 420, isRunning: false, isPaused: false }
        } : null
      }
    }));
  };

  const handleTick = useCallback(() => {
    setMatchState(prev => {
      if (!prev.session.currentMatch) return prev;
      
      if (prev.session.currentMatch.timer.seconds <= 1) {
        toast.error("TEMPO ESGOTADO! ⏰", { duration: 5000 });
        return {
          ...prev,
          session: {
            ...prev.session,
            currentMatch: {
              ...prev.session.currentMatch,
              timer: { seconds: 0, isRunning: false, isPaused: false }
            }
          }
        };
      }
      
      return {
        ...prev,
        session: {
          ...prev.session,
          currentMatch: {
            ...prev.session.currentMatch,
            timer: {
              ...prev.session.currentMatch.timer,
              seconds: prev.session.currentMatch.timer.seconds - 1
            }
          }
        }
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

  // Handler para gols
  const handleGoalScored = (player: Player, team: Team) => {
    if (!matchState.session.currentMatch || matchState.session.currentMatch.winner) return;

    const eventId = `goal-${Date.now()}-${Math.random()}`;
    const goalEvent: MatchEvent = {
      id: eventId,
      type: 'goal',
      playerId: player.id,
      playerName: player.name,
      team: team.name,
      teamId: team.id,
      minute: formatTimeForEvent(matchState.session.currentMatch.timer.seconds),
      timestamp: new Date()
    };

    setMatchState(prev => {
      if (!prev.session.currentMatch) return prev;

      const isTeamA = team.id === prev.session.currentMatch.teamA.id;
      const newScore = {
        teamA: isTeamA ? prev.session.currentMatch.score.teamA + 1 : prev.session.currentMatch.score.teamA,
        teamB: !isTeamA ? prev.session.currentMatch.score.teamB + 1 : prev.session.currentMatch.score.teamB
      };

      // Verificar vitória (primeiro a 2 gols)
      const winner = newScore.teamA >= 2 ? prev.session.currentMatch.teamA :
                     newScore.teamB >= 2 ? prev.session.currentMatch.teamB : null;

      return {
        ...prev,
        session: {
          ...prev.session,
          currentMatch: {
            ...prev.session.currentMatch,
            score: newScore,
            events: [...prev.session.currentMatch.events, goalEvent],
            winner,
            timer: winner ? { ...prev.session.currentMatch.timer, isRunning: false } : prev.session.currentMatch.timer
          }
        }
      };
    });

    // Ativar seleção de assistência
    setPendingAssist({
      goalEvent,
      isWaiting: true
    });

    toast.success(`⚽ GOL! ${player.name} (${team.name})`);
  };

  // Handler para assistências
  const handleAssistAdded = (assistPlayer: Player | null) => {
    if (!pendingAssist.goalEvent) return;

    const updatedEvent: MatchEvent = {
      ...pendingAssist.goalEvent,
      assistPlayerId: assistPlayer?.id,
      assistPlayerName: assistPlayer?.name
    };

    setMatchState(prev => ({
      ...prev,
      session: {
        ...prev.session,
        currentMatch: prev.session.currentMatch ? {
          ...prev.session.currentMatch,
          events: prev.session.currentMatch.events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
          )
        } : null
      }
    }));

    // Limpar assistência pendente
    setPendingAssist({
      goalEvent: null,
      isWaiting: false
    });

    if (assistPlayer) {
      toast.success(`👏 Assistência de ${assistPlayer.name}!`);
    }
  };

  // Handler para desfazer evento
  const handleUndoEvent = (eventId: string) => {
    if (!matchState.session.currentMatch) return;

    const event = matchState.session.currentMatch.events.find(e => e.id === eventId);
    if (!event) return;

    setMatchState(prev => {
      if (!prev.session.currentMatch) return prev;

      const newEvents = prev.session.currentMatch.events.filter(e => e.id !== eventId);
      const teamKey = event.teamId === prev.session.currentMatch.teamA.id ? 'teamA' : 'teamB';
      
      return {
        ...prev,
        session: {
          ...prev.session,
          currentMatch: {
            ...prev.session.currentMatch,
            events: newEvents,
            score: {
              ...prev.session.currentMatch.score,
              [teamKey]: Math.max(0, prev.session.currentMatch.score[teamKey] - 1)
            },
            winner: null // Remove winner se desfizer gol
          }
        }
      };
    });

    toast.info(`Evento desfeito: ${event.playerName}`);
  };

  // Handler para finalizar partida
  const handleFinishMatch = () => {
    if (!matchState.session.currentMatch || !matchState.session.currentMatch.winner) return;

    const completedMatch: CompletedMatch = {
      id: `match-${Date.now()}`,
      teamA: matchState.session.currentMatch.teamA,
      teamB: matchState.session.currentMatch.teamB,
      finalScore: matchState.session.currentMatch.score,
      winner: matchState.session.currentMatch.winner,
      events: matchState.session.currentMatch.events,
      duration: 420 - matchState.session.currentMatch.timer.seconds,
      timestamp: new Date()
    };

    setMatchState(prev => ({
      ...prev,
      phase: 'match-ended',
      session: {
        ...prev.session,
        matchHistory: [...prev.session.matchHistory, completedMatch]
      }
    }));

    toast.success("Partida finalizada!");
  };

  // Handler para próxima partida
  const handleStartNextMatch = () => {
    if (!matchState.session.currentMatch) return;

    const { winner, teamA, teamB, waitingTeam } = matchState.session.currentMatch;
    if (!winner) return;

    // Winner continua, perdedor vira waiting, waiting entra
    const loser = winner.id === teamA.id ? teamB : teamA;
    
    setMatchState(prev => ({
      ...prev,
      phase: 'live-match',
      session: {
        ...prev.session,
        currentMatch: {
          teamA: winner,
          teamB: waitingTeam,
          waitingTeam: loser,
          score: { teamA: 0, teamB: 0 },
          events: [],
          timer: { seconds: 420, isRunning: false, isPaused: false },
          winner: null
        }
      }
    }));

    toast.success(`Nova partida: ${winner.name} vs ${waitingTeam.name}`);
  };

  // Handler para voltar à seleção
  const handleBackToSelection = () => {
    setMatchState(prev => ({
      ...prev,
      phase: 'team-selection'
    }));
  };

  // Reset completo
  const handleCompleteReset = () => {
    setMatchState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    toast.info("Sistema resetado!");
  };

  // Renderização baseada na fase
  switch (matchState.phase) {
    case 'setup':
      return (
        <TeamDraw
          confirmedPlayers={matchState.session.confirmedPlayers}
          onTeamsGenerated={handleTeamsGenerated}
        />
      );

    case 'team-selection':
      return (
        <MatchSelection
          teams={matchState.session.teams}
          onMatchStart={handleMatchStart}
        />
      );

    case 'live-match':
      if (!matchState.session.currentMatch) {
        return <div>Erro: partida não encontrada</div>;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Placar Realista */}
            <RealisticScoreboard
              teamA={matchState.session.currentMatch.teamA}
              teamB={matchState.session.currentMatch.teamB}
              scoreA={matchState.session.currentMatch.score.teamA}
              scoreB={matchState.session.currentMatch.score.teamB}
              timer={matchState.session.currentMatch.timer}
              winner={matchState.session.currentMatch.winner}
            />

            {/* Cronômetro */}
            <MatchTimer
              seconds={matchState.session.currentMatch.timer.seconds}
              isRunning={matchState.session.currentMatch.timer.isRunning}
              isPaused={matchState.session.currentMatch.timer.isPaused}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onTick={handleTick}
            />

            {/* Marcação de Gols */}
            <GoalTracker
              teamA={matchState.session.currentMatch.teamA}
              teamB={matchState.session.currentMatch.teamB}
              onGoalScored={handleGoalScored}
              pendingAssist={pendingAssist}
              onAssistAdded={handleAssistAdded}
              scoreA={matchState.session.currentMatch.score.teamA}
              scoreB={matchState.session.currentMatch.score.teamB}
              winner={matchState.session.currentMatch.winner}
            />

            {/* Botão Finalizar quando houver vencedor */}
            {matchState.session.currentMatch.winner && (
              <div className="text-center">
                <Button
                  onClick={handleFinishMatch}
                  className="px-12 py-6 text-2xl font-bold bg-yellow-600 hover:bg-yellow-700 text-black border-2 border-yellow-400"
                >
                  ✅ FINALIZAR PARTIDA
                </Button>
              </div>
            )}

            {/* Histórico de Eventos */}
            <EventHistory
              events={matchState.session.currentMatch.events}
              onUndoEvent={handleUndoEvent}
            />

            {/* Botão de Reset de Emergência */}
            <div className="text-center mt-8">
              <Button
                onClick={handleCompleteReset}
                variant="outline"
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                🔄 RESETAR SISTEMA COMPLETO
              </Button>
            </div>
          </div>
        </div>
      );

    case 'match-ended':
      const lastMatch = matchState.session.matchHistory[matchState.session.matchHistory.length - 1];
      if (!lastMatch) return <div>Erro: partida não encontrada</div>;

      // Calcular próxima partida
      const currentMatch = matchState.session.currentMatch;
      const nextMatch = currentMatch ? {
        teamA: lastMatch.winner,
        teamB: currentMatch.waitingTeam,
        waitingTeam: lastMatch.winner.id === currentMatch.teamA.id ? currentMatch.teamB : currentMatch.teamA
      } : null;

      return (
        <MatchEnd
          completedMatch={lastMatch}
          nextMatch={nextMatch}
          onStartNextMatch={handleStartNextMatch}
          onBackToSelection={handleBackToSelection}
        />
      );

    default:
      return <div>Estado inválido</div>;
  }
}
