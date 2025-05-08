import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Match, ChatMessage } from '../types';
import { mockUsers, mockMatches, mockChatMessages } from '../data/mockData';
import { toast } from '@/components/ui/sonner';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  chatMessages: ChatMessage[];
  login: (userId: string) => void;
  createMatch: (match: Omit<Match, 'id' | 'confirmedPlayers'>) => void;
  confirmPresence: (matchId: string) => void;
  cancelPresence: (matchId: string) => void;
  sortTeams: (matchId: string) => void;
  sendMessage: (message: string) => void;
  recordMatchResult: (matchId: string, teamAScore: number, teamBScore: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      toast.success(`Bem-vindo, ${user.name}!`);
    }
  };

  const createMatch = (matchData: Omit<Match, 'id' | 'confirmedPlayers'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `${matches.length + 1}`,
      confirmedPlayers: currentUser ? [currentUser] : [],
    };

    setMatches([...matches, newMatch]);
    toast.success('Partida criada com sucesso!');
  };

  const confirmPresence = (matchId: string) => {
    if (!currentUser) return;

    setMatches(matches.map(match => {
      if (match.id === matchId) {
        if (match.confirmedPlayers.length >= match.maxPlayers) {
          toast.error('A partida já atingiu o limite de jogadores!');
          return match;
        }
        
        if (match.confirmedPlayers.some(player => player.id === currentUser.id)) {
          toast.info('Você já está confirmado nesta partida.');
          return match;
        }
        
        toast.success('Presença confirmada!');
        return {
          ...match,
          confirmedPlayers: [...match.confirmedPlayers, currentUser],
        };
      }
      return match;
    }));
  };

  const cancelPresence = (matchId: string) => {
    if (!currentUser) return;

    setMatches(matches.map(match => {
      if (match.id === matchId) {
        toast.success('Presença cancelada.');
        return {
          ...match,
          confirmedPlayers: match.confirmedPlayers.filter(
            player => player.id !== currentUser.id
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

  const sendMessage = (message: string) => {
    if (!currentUser || !message.trim()) return;

    const newMessage: ChatMessage = {
      id: `${chatMessages.length + 1}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, newMessage]);
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

          setUsers(users.map(user => {
            if (match.confirmedPlayers.some(p => p.id === user.id)) {
              return {
                ...user,
                stats: {
                  ...user.stats,
                  matches: user.stats.matches + 1,
                  wins: winners.some(p => p.id === user.id) ? user.stats.wins + 1 : user.stats.wins
                }
              };
            }
            return user;
          }));
        }

        toast.success('Resultado registrado com sucesso!');
        return updatedMatch;
      }
      return match;
    }));
  };

  const value = {
    currentUser,
    users,
    matches,
    chatMessages,
    login,
    createMatch,
    confirmPresence,
    cancelPresence,
    sortTeams,
    sendMessage,
    recordMatchResult
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
