import React, { createContext, useContext, ReactNode } from 'react';
import { Match, User } from '../types';
import { toast } from '@/components/ui/sonner';
import { useUserContext } from './UserContext';
import { useAdminContext } from './AdminContext';
import { CreateMatchData } from '@/types/admin';

interface MatchContextType {
  matches: Match[];
  createMatch: (matchData: CreateMatchData) => Promise<void>;
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
  const { user, users, updateUserStats } = useUserContext();
  const { scheduledMatches, confirmPlayerAttendance, cancelPlayerAttendance, createMatch: adminCreateMatch, updateMatch } = useAdminContext();
  
  // Convert scheduledMatches to Match format with proper type mapping
  const matches: Match[] = scheduledMatches.map(match => ({
    id: match.id,
    date: match.date,
    time: match.time,
    location: match.location,
    maxPlayers: match.maxPlayers,
    // Map admin status to match status
    status: match.status === 'active' ? 'scheduled' : 
            match.status === 'completed' ? 'completed' : 
            match.status === 'cancelled' ? 'canceled' : 'scheduled',
    confirmedPlayers: match.confirmedPlayers.map(playerId => 
      users.find(u => u.id === playerId) || { id: playerId } as User
    ),
    teams: (match as any).teams || undefined,
    result: (match as any).result || undefined
  }));

  const createMatch = async (matchData: CreateMatchData): Promise<void> => {
    return adminCreateMatch(matchData);
  };

  const confirmPresence = (matchId: string) => {
    if (!user) return;
    confirmPlayerAttendance(matchId, user.id);
  };

  const cancelPresence = (matchId: string) => {
    if (!user) return;
    cancelPlayerAttendance(matchId, user.id);
  };

  const sortTeams = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Simple balanced team sorting algorithm
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

    // Update the match with teams (cast to any to bypass type checking for teams property)
    updateMatch(matchId, {
      ...(scheduledMatches.find(m => m.id === matchId) as any),
      teams: { teamA, teamB }
    });

    toast.success('Times sorteados com sucesso!');
  };

  const recordMatchResult = (matchId: string, teamAScore: number, teamBScore: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Update the match status and result (cast to any to bypass type checking)
    updateMatch(matchId, {
      status: "completed",
      ...(scheduledMatches.find(m => m.id === matchId) as any),
      result: {
        teamAScore,
        teamBScore
      }
    });

    // Update player stats
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
