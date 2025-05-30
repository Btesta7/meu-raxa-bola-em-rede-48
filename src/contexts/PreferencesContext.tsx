
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, DashboardWidget, WidgetType } from '@/types/preferences';
import { useUserContext } from './UserContext';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateDashboardLayout: (widgets: DashboardWidget[]) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferencesContext = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  }
  return context;
};

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'personal-stats',
    title: 'Minhas Estatísticas',
    type: WidgetType.PERSONAL_STATS,
    size: 'medium',
    position: { row: 0, col: 0 },
    isVisible: true
  },
  {
    id: 'upcoming-matches',
    title: 'Próximas Partidas',
    type: WidgetType.UPCOMING_MATCHES,
    size: 'large',
    position: { row: 0, col: 1 },
    isVisible: true
  },
  {
    id: 'notifications',
    title: 'Notificações',
    type: WidgetType.NOTIFICATIONS,
    size: 'medium',
    position: { row: 1, col: 0 },
    isVisible: true
  },
  {
    id: 'quick-actions',
    title: 'Ações Rápidas',
    type: WidgetType.QUICK_ACTIONS,
    size: 'small',
    position: { row: 1, col: 1 },
    isVisible: true
  }
];

const defaultPreferences: UserPreferences = {
  theme: 'light',
  notifications: {
    enabled: true,
    matchReminders: true,
    teamUpdates: true,
    chatMessages: false,
    systemAnnouncements: true
  },
  dashboardLayout: defaultWidgets,
  onboardingCompleted: false,
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo'
};

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      setPreferences(defaultPreferences);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const savedPreferences = localStorage.getItem(`user_preferences_${user?.id}`);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } else {
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      setPreferences(defaultPreferences);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = (newPreferences: UserPreferences) => {
    if (user) {
      localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(newPreferences));
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateDashboardLayout = (widgets: DashboardWidget[]) => {
    const newPreferences = { ...preferences, dashboardLayout: widgets };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    if (user) {
      localStorage.removeItem(`user_preferences_${user.id}`);
    }
  };

  const value = {
    preferences,
    updatePreferences,
    updateDashboardLayout,
    resetToDefaults,
    isLoading
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
