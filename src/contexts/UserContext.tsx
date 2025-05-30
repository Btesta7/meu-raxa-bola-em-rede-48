import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, ImportedStats } from '../types';
import { mockUsers } from '../data/mockData';
import { toast } from '@/components/ui/sonner';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateUserStats: (userId: string, updates: Partial<User['stats']>) => void;
  importPlayerStats: (stats: ImportedStats[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Mudança: inicia sem usuário logado
  const [users, setUsers] = useState<User[]>(mockUsers.map(user => ({
    ...user,
    isAdmin: user.id === 'user-1' // Definir primeiro usuário como admin
  })));

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      toast.success(`Bem-vindo, ${user.name}!`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success('Você saiu do sistema.');
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, ...updates } 
          : user
      )
    );
    
    // Atualizar currentUser se for o usuário logado
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    
    toast.success('Perfil atualizado com sucesso!');
  };

  const updateUserStats = (userId: string, updates: Partial<User['stats']>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, stats: { ...user.stats, ...updates } } 
          : user
      )
    );
  };

  // Função para importar estatísticas de jogadores a partir de dados extraídos de PDF
  const importPlayerStats = (stats: ImportedStats[]) => {
    let updatedCount = 0;
    let newCount = 0;

    // Para cada estatística importada
    stats.forEach(importedStat => {
      // Procura usuário existente com o mesmo nome
      const existingUserIndex = users.findIndex(u => 
        u.name.toLowerCase() === importedStat.name.toLowerCase()
      );

      if (existingUserIndex !== -1) {
        // Atualiza usuário existente
        const updatedUser = { ...users[existingUserIndex] };
        updatedUser.stats = {
          ...updatedUser.stats,
          goals: importedStat.goals ?? updatedUser.stats.goals,
          assists: importedStat.assists ?? updatedUser.stats.assists,
          matches: importedStat.matches ?? updatedUser.stats.matches,
          wins: importedStat.wins ?? updatedUser.stats.wins,
          attendance: importedStat.attendance ?? updatedUser.stats.attendance,
          yellowCards: importedStat.yellowCards ?? updatedUser.stats.yellowCards,
          redCards: importedStat.redCards ?? updatedUser.stats.redCards
        };
        
        if (importedStat.position) {
          updatedUser.position = importedStat.position;
        }

        const updatedUsers = [...users];
        updatedUsers[existingUserIndex] = updatedUser;
        setUsers(updatedUsers);
        updatedCount++;
      } else if (importedStat.name && importedStat.name.trim() !== "") {
        // Cria novo usuário apenas se o nome for válido
        const newUser: User = {
          id: `user-${Date.now()}-${newCount}`,
          name: importedStat.name,
          position: importedStat.position || "Meio-campista",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(importedStat.name)}`,
          stats: {
            goals: importedStat.goals || 0,
            assists: importedStat.assists || 0,
            matches: importedStat.matches || 0,
            wins: importedStat.wins || 0,
            attendance: importedStat.attendance || 0,
            yellowCards: importedStat.yellowCards || 0,
            redCards: importedStat.redCards || 0
          }
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        newCount++;
      }
    });

    toast.success(`Importação concluída: ${updatedCount} jogadores atualizados, ${newCount} novos jogadores adicionados.`);
  };

  const value = {
    currentUser,
    users,
    login,
    logout,
    updateUserProfile,
    updateUserStats,
    importPlayerStats
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
