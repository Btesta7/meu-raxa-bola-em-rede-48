import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, ImportedStats, AuthCredentials, RegisterData, AuthState, OnboardingData } from '../types';
import { mockUsers } from '../data/mockData';
import { toast } from '@/components/ui/sonner';
import { validateLoginForm, validateRegisterForm, sanitizeInput } from '@/utils/validation';
import { saveSession, getStoredSession, clearSession, generateAvatar } from '@/utils/auth';
import { checkProfileCompletion } from '@/hooks/useOnboarding';
import { sanitizeOnboardingData } from '@/utils/onboardingValidation';
import { AuditAction } from '@/types/audit';

interface UserContextType extends AuthState {
  users: User[];
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isEmailAvailable: (email: string) => boolean;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateUserStats: (userId: string, updates: Partial<User['stats']>) => void;
  importPlayerStats: (stats: ImportedStats[]) => void;
  clearError: () => void;
  isNewUser: boolean;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
  saveOnboardingStep: (step: number, data: Partial<OnboardingData>) => Promise<boolean>;
  logAuditAction?: (action: AuditAction, resource: string, details?: any, resourceId?: string) => void;
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
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [logAuditAction, setLogAuditAction] = useState<((action: AuditAction, resource: string, details?: any, resourceId?: string) => void) | undefined>();

  // This will be set by AuditProvider
  const setAuditLogger = (logger: (action: AuditAction, resource: string, details?: any, resourceId?: string) => void) => {
    setLogAuditAction(() => logger);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Carregar usuários mock (incluindo admins)
        const updatedMockUsers = mockUsers.map(user => ({
          ...user,
          isAdmin: user.id === '1' || user.id === '2' // Fazer os primeiros dois usuários admins
        }));
        setUsers(updatedMockUsers);
        
        // Verificar se há sessão armazenada
        const storedUser = getStoredSession();
        if (storedUser) {
          // Verificar se o usuário ainda existe na base de dados
          const userExists = updatedMockUsers.find(u => u.id === storedUser.id && u.email === storedUser.email);
          if (userExists) {
            setAuthState({
              isAuthenticated: true,
              user: userExists,
              isLoading: false,
              error: null
            });
            return;
          } else {
            // Se o usuário não existe mais, limpar sessão
            clearSession();
          }
        }
        
        setAuthState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Erro ao carregar dados'
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validar formulário
      const validationErrors = validateLoginForm(credentials);
      if (validationErrors.length > 0) {
        setAuthState(prev => ({ ...prev, error: validationErrors[0], isLoading: false }));
        logAuditAction?.(AuditAction.LOGIN_FAILED, 'user', { email: credentials.email, reason: 'validation_error' });
        return false;
      }

      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sanitizar inputs
      const email = sanitizeInput(credentials.email.toLowerCase());
      
      // Verificar credenciais
      const user = users.find(u => u.email.toLowerCase() === email);
      if (!user) {
        setAuthState(prev => ({ ...prev, error: 'Credenciais inválidas', isLoading: false }));
        logAuditAction?.(AuditAction.LOGIN_FAILED, 'user', { email: credentials.email, reason: 'user_not_found' });
        return false;
      }

      // Em um sistema real, verificaríamos a senha hasheada
      // Por enquanto, usamos uma validação simples baseada no ID
      const expectedPassword = `password${user.id}`;
      if (credentials.password !== expectedPassword) {
        setAuthState(prev => ({ ...prev, error: 'Credenciais inválidas', isLoading: false }));
        logAuditAction?.(AuditAction.LOGIN_FAILED, 'user', { email: credentials.email, reason: 'invalid_password' });
        return false;
      }

      // Atualizar último login
      const updatedUser = { ...user, lastLogin: new Date() };
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      // Salvar sessão
      saveSession(updatedUser, credentials.rememberMe || false);

      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
        error: null
      });

      setIsNewUser(false); // Reset new user flag on login
      logAuditAction?.(AuditAction.LOGIN, 'user', { userId: user.id }, user.id);
      toast.success(`Bem-vindo, ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, error: 'Erro interno do sistema', isLoading: false }));
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validar formulário
      const validationErrors = validateRegisterForm(data);
      if (validationErrors.length > 0) {
        setAuthState(prev => ({ ...prev, error: validationErrors[0], isLoading: false }));
        return false;
      }

      // Verificar se email já existe
      if (!isEmailAvailable(data.email)) {
        setAuthState(prev => ({ ...prev, error: 'Este email já está em uso', isLoading: false }));
        return false;
      }

      // Simular delay de criação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sanitizar dados
      const sanitizedData = {
        email: sanitizeInput(data.email.toLowerCase()),
        name: sanitizeInput(data.name),
        position: data.position
      };

      // Criar novo usuário
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: sanitizedData.email,
        name: sanitizedData.name,
        position: sanitizedData.position,
        avatar: generateAvatar(sanitizedData.name),
        stats: {
          goals: 0,
          assists: 0,
          matches: 0,
          wins: 0,
          attendance: 0,
          yellowCards: 0,
          redCards: 0
        },
        isAdmin: false,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        isProfileComplete: false
      };

      // Adicionar usuário à lista
      setUsers(prev => [...prev, newUser]);

      // Fazer login automático
      saveSession(newUser, false);
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        error: null
      });

      setIsNewUser(true); // Mark as new user
      toast.success(`Conta criada com sucesso! Bem-vindo, ${newUser.name}!`);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, error: 'Erro interno do sistema', isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    if (authState.user) {
      logAuditAction?.(AuditAction.LOGOUT, 'user', { userId: authState.user.id }, authState.user.id);
    }
    clearSession();
    setIsNewUser(false);
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
    toast.success('Você saiu do sistema.');
  };

  const isEmailAvailable = (email: string): boolean => {
    return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // NOVAS FUNÇÕES DE ONBOARDING
  const completeOnboarding = async (data: OnboardingData): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const sanitizedData = sanitizeOnboardingData(data);
      
      const updatedUser: User = {
        ...authState.user,
        name: sanitizedData.name,
        age: sanitizedData.age,
        phone: sanitizedData.phone,
        position: sanitizedData.position,
        secondaryPositions: sanitizedData.secondaryPositions,
        preferredFoot: sanitizedData.preferredFoot,
        yearsPlaying: sanitizedData.yearsPlaying,
        bio: sanitizedData.bio,
        emergencyContact: sanitizedData.emergencyContact,
        isProfileComplete: true,
        preferences: {
          notifications: true,
          privacy: 'public'
        }
      };

      // Atualizar no estado
      setUsers(prev => prev.map(u => u.id === authState.user!.id ? updatedUser : u));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Atualizar sessão
      saveSession(updatedUser, false);
      
      setIsNewUser(false);
      logAuditAction?.(AuditAction.PROFILE_UPDATE, 'user', { onboardingCompleted: true }, updatedUser.id);
      toast.success('Perfil completado com sucesso! Bem-vindo ao Meu Raxa!');
      return true;
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      toast.error('Erro ao completar perfil');
      return false;
    }
  };

  const saveOnboardingStep = async (step: number, data: Partial<OnboardingData>): Promise<boolean> => {
    // Em um sistema real, salvaria o progresso no backend
    console.log(`Salvando step ${step}:`, data);
    return true;
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
    if (authState.user && authState.user.id === userId) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      // Atualizar sessão salva
      saveSession(updatedUser, false);
    }
    
    logAuditAction?.(AuditAction.PROFILE_UPDATE, 'user', updates, userId);
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

  const importPlayerStats = (stats: ImportedStats[]) => {
    let updatedCount = 0;
    let newCount = 0;

    stats.forEach(importedStat => {
      const existingUserIndex = users.findIndex(u => 
        u.name.toLowerCase() === importedStat.name.toLowerCase()
      );

      if (existingUserIndex !== -1) {
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
        const newUser: User = {
          id: `user-${Date.now()}-${newCount}`,
          email: `${sanitizeInput(importedStat.name.toLowerCase().replace(/\s+/g, '.'))}@exemplo.com`,
          name: importedStat.name,
          position: importedStat.position || "Meio-campista",
          avatar: generateAvatar(importedStat.name),
          stats: {
            goals: importedStat.goals || 0,
            assists: importedStat.assists || 0,
            matches: importedStat.matches || 0,
            wins: importedStat.wins || 0,
            attendance: importedStat.attendance || 0,
            yellowCards: importedStat.yellowCards || 0,
            redCards: importedStat.redCards || 0
          },
          isAdmin: false,
          isActive: true,
          createdAt: new Date()
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        newCount++;
      }
    });

    toast.success(`Importação concluída: ${updatedCount} jogadores atualizados, ${newCount} novos jogadores adicionados.`);
  };

  const value = {
    ...authState,
    users,
    login,
    register,
    logout,
    isEmailAvailable,
    updateUserProfile,
    updateUserStats,
    importPlayerStats,
    clearError,
    isNewUser,
    completeOnboarding,
    saveOnboardingStep,
    logAuditAction,
  };

  // Expose the setAuditLogger for AuditProvider to use
  React.useEffect(() => {
    (window as any).setUserContextAuditLogger = setAuditLogger;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
