import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MatchSchedule, CreateMatchData, PlayerConfirmation, AdminContextType } from '@/types/admin';
import { useUserContext } from './UserContext';
import { toast } from '@/components/ui/sonner';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, users } = useUserContext();
  const [scheduledMatches, setScheduledMatches] = useState<MatchSchedule[]>([]);
  const [confirmations, setConfirmations] = useState<PlayerConfirmation[]>([]);

  const isAdmin = user?.isAdmin === true;

  // Mock data inicial com datas futuras e mais jogadores
  useEffect(() => {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));
    
    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + ((3 - today.getDay() + 7) % 7));
    if (nextWednesday <= today) {
      nextWednesday.setDate(nextWednesday.getDate() + 7);
    }

    // Criar lista com mais jogadores para testes (pelos menos 15)
    const mockPlayerIds = users.slice(0, 18).map(u => u.id);

    const mockMatches: MatchSchedule[] = [
      {
        id: 'match-001',
        title: 'Pelada Domingo',
        date: nextSunday.toISOString().split('T')[0],
        time: '15:00',
        location: 'Quadra Central',
        maxPlayers: 20,
        description: 'Partida tradicional de domingo',
        status: 'active',
        createdBy: '1', // Carlos Silva (admin)
        createdAt: new Date('2024-12-01'),
        confirmedPlayers: mockPlayerIds.slice(0, 16), // 16 jogadores confirmados
        waitingList: []
      },
      {
        id: 'match-002',
        title: 'Pelada Quarta',
        date: nextWednesday.toISOString().split('T')[0],
        time: '19:00',
        location: 'Campo Sintético',
        maxPlayers: 16,
        description: 'Partida noturna',
        status: 'active',
        createdBy: '1', // Carlos Silva (admin)
        createdAt: new Date('2024-12-01'),
        confirmedPlayers: mockPlayerIds.slice(0, 15), // 15 jogadores confirmados (mínimo)
        waitingList: []
      }
    ];
    setScheduledMatches(mockMatches);
  }, [users]);

  const createMatch = async (matchData: CreateMatchData): Promise<void> => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem criar partidas');
    }

    const newMatch: MatchSchedule = {
      id: `match-${Date.now()}`,
      ...matchData,
      status: 'active',
      createdBy: user!.id,
      createdAt: new Date(),
      confirmedPlayers: [],
      waitingList: []
    };

    setScheduledMatches(prev => [...prev, newMatch]);
    toast.success('Partida criada com sucesso!');
  };

  const updateMatch = async (matchId: string, updates: Partial<MatchSchedule>): Promise<void> => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem editar partidas');
    }

    setScheduledMatches(prev => 
      prev.map(match => 
        match.id === matchId ? { ...match, ...updates } : match
      )
    );
    toast.success('Partida atualizada com sucesso!');
  };

  const deleteMatch = async (matchId: string): Promise<void> => {
    if (!isAdmin) {
      throw new Error('Apenas administradores podem deletar partidas');
    }

    setScheduledMatches(prev => prev.filter(match => match.id !== matchId));
    toast.success('Partida deletada com sucesso!');
  };

  const confirmPlayerAttendance = async (matchId: string, playerId: string): Promise<void> => {
    const match = scheduledMatches.find(m => m.id === matchId);
    if (!match) return;

    if (match.confirmedPlayers.length >= match.maxPlayers) {
      // Adicionar à lista de espera
      setScheduledMatches(prev =>
        prev.map(m =>
          m.id === matchId
            ? { ...m, waitingList: [...m.waitingList, playerId] }
            : m
        )
      );
      toast.info('Adicionado à lista de espera');
    } else {
      // Confirmar presença
      setScheduledMatches(prev =>
        prev.map(m =>
          m.id === matchId
            ? { ...m, confirmedPlayers: [...m.confirmedPlayers, playerId] }
            : m
        )
      );

      const confirmation: PlayerConfirmation = {
        matchId,
        playerId,
        status: 'confirmed',
        confirmedAt: new Date()
      };
      setConfirmations(prev => [...prev, confirmation]);
      toast.success('Presença confirmada!');
    }
  };

  const cancelPlayerAttendance = async (matchId: string, playerId: string): Promise<void> => {
    setScheduledMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? {
              ...m,
              confirmedPlayers: m.confirmedPlayers.filter(id => id !== playerId),
              waitingList: m.waitingList.filter(id => id !== playerId)
            }
          : m
      )
    );

    setConfirmations(prev =>
      prev.filter(c => !(c.matchId === matchId && c.playerId === playerId))
    );
    toast.success('Presença cancelada');
  };

  const getMatchConfirmations = async (matchId: string): Promise<PlayerConfirmation[]> => {
    return confirmations.filter(c => c.matchId === matchId);
  };

  const value: AdminContextType = {
    isAdmin,
    scheduledMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchConfirmations,
    confirmPlayerAttendance,
    cancelPlayerAttendance
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
