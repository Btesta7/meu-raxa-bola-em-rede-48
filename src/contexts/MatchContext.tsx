
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Match, User } from '../types';
import { mockMatches } from '../data/mockData';
import { toast } from '@/components/ui/sonner';
import { useUserContext } from './UserContext';

interface MatchContextType {
  matches: Match[];
  createMatch: (match: Omit<Match, 'id' | 'confirmedPlayers'>) => void;
  confirmPresence: (matchId: string) => void;
  cancelPresence: (matchId: string) => void;
  sortTeams: (matchId: string) => void;
  recordMatchResult: (matchId: string, teamAScore: number, teamBScore: number) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const useMatchContext = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatchContext must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const { user, users, updateUserStats } = useUserContext();

  const createMatch = (matchData: Omit<Match, 'id' | 'confirmedPlayers'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `${matches.length + 1}`,
      confirmedPlayers: user ? [user] : [],
    };

    setMatches([...matches, newMatch]);
    toast.success('Partida criada com sucesso!');
  };

  const confirmPresence = (matchId: string) => {
    if (!user) return;

    setMatches(matches.map(match => {
      if (match.id === matchId) {
        if (match.confirmedPlayers.length >= match.maxPlayers) {
          toast.error('A partida já atingiu o limite de jogadores!');
          return match;
        }
        
        if (match.confirmedPlayers.some(player => player.id === user.id)) {
          toast.info('Você já está confirmado nesta partida.');
          return match;
        }
        
        toast.success('Presença confirmada!');
        return {
          ...match,
          confirmedPlayers: [...match.confirmedPlayers, user],
        };
      }
      return match;
    }));
  };

  const cancelPresence = (matchId: string) => {
    if (!user) return;

    setMatches(matches.map(match => {
      if (match.id === matchId) {
        toast.success('Presença cancelada.');
        return {
          ...match,
          confirmedPlayers: match.confirmedPlayers.filter(
            player => player.id !== user.id
          ),
        };
      }
      return match;
    }));
  };

  // Function to balance teams based on positions and skill level
  const sortTeams = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Simple balanced team sorting algorithm
    // In reality, this would be more sophisticated based on player stats
    const players = [...match.confirmedPlayers];
    const goalkeepers = players.filter(p => p.position === "Goleiro");
    const defenders = players.filter(p => p.position === "Defensor");
    const midfielders = players.filter(p => p.position === "Meio-campista");
    const forwards = players.filter(p => p.position === "Atacante");

    const teamA: User[] = [];
    const teamB: User[] = [];

    // Distribute goalkeepers
    if (goalkeepers.length >= 2) {
      teamA.push(goalkeepers[0]);
      teamB.push(goalkeepers[1]);
    } else if (goalkeepers.length === 1) {
      teamA.push(goalkeepers[0]);
    }

    // Distribute other positions evenly
    const distributeEvenly = (positionPlayers: User[]) => {
      positionPlayers.forEach((player, index) => {
        if (!teamA.includes(player) && !teamB.includes(player)) {
          if (index % 2 === 0 && teamA.length < match.maxPlayers / 2) {
            teamA.push(player);
          } else if (teamB.length < match.maxPlayers / 2) {
            teamB.push(player);
          } else {
            teamA.push(player);
          }
        }
      });
    };

    distributeEvenly(defenders);
    distributeEvenly(midfielders);
    distributeEvenly(forwards);

    // Add any remaining players
    players.forEach(player => {
      if (!teamA.includes(player) && !teamB.includes(player)) {
        if (teamA.length < teamB.length) {
          teamA.push(player);
        } else {
          teamB.push(player);
        }
      }
    });

    setMatches(matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          teams: { teamA, teamB }
        };
      }
      return m;
    }));

    toast.success('Times sorteados com sucesso!');
  };

  const recordMatchResult = (matchId: string, teamAScore: number, teamBScore: number) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        // Update match result
        const updatedMatch = {
          ...match,
          status: "completed" as const,
          result: {
            teamAScore,
            teamBScore
          }
        };

        // Update player stats (simplified version)
        if (match.teams) {
          const winners = teamAScore > teamBScore ? match.teams.teamA : 
                         teamBScore > teamAScore ? match.teams.teamB : [];

          match.confirmedPlayers.forEach(player => {
            updateUserStats(player.id, {
              matches: player.stats.matches + 1,
              wins: winners.some(p => p.id === player.id) ? player.stats.wins + 1 : player.stats.wins
            });
          });
        }

        toast.success('Resultado registrado com sucesso!');
        return updatedMatch;
      }
      return match;
    }));
  };

  const value = {
    matches,
    createMatch,
    confirmPresence,
    cancelPresence,
    sortTeams,
    recordMatchResult
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};
