
import React, { createContext, useContext, ReactNode } from 'react';
import { UserProvider, useUserContext } from './UserContext';
import { MatchProvider, useMatchContext } from './MatchContext';
import { ChatProvider, useChatContext } from './ChatContext';
import { PreferencesProvider } from './PreferencesContext';
import { NotificationProvider } from './NotificationContext';
import { AdminProvider } from './AdminContext';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';

// Combined context type that re-exports from all subcontexts
interface AppContextType {
  // From UserContext
  currentUser: ReturnType<typeof useUserContext>['user'];
  users: ReturnType<typeof useUserContext>['users'];
  login: ReturnType<typeof useUserContext>['login'];
  logout: ReturnType<typeof useUserContext>['logout'];
  updateUserProfile: ReturnType<typeof useUserContext>['updateUserProfile'];
  importPlayerStats: ReturnType<typeof useUserContext>['importPlayerStats'];
  
  // From MatchContext
  matches: ReturnType<typeof useMatchContext>['matches'];
  createMatch: ReturnType<typeof useMatchContext>['createMatch'];
  confirmPresence: ReturnType<typeof useMatchContext>['confirmPresence'];
  cancelPresence: ReturnType<typeof useMatchContext>['cancelPresence'];
  sortTeams: ReturnType<typeof useMatchContext>['sortTeams'];
  recordMatchResult: ReturnType<typeof useMatchContext>['recordMatchResult'];
  
  // From ChatContext
  chatMessages: ReturnType<typeof useChatContext>['chatMessages'];
  sendMessage: ReturnType<typeof useChatContext>['sendMessage'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Combined provider that wraps all subproviders in the correct order
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <PreferencesProvider>
        <NotificationProvider>
          <AdminProvider>
            <MatchProvider>
              <ChatProvider>
                <OnboardingProvider>
                  <AppContextCombiner>
                    {children}
                  </AppContextCombiner>
                </OnboardingProvider>
              </ChatProvider>
            </MatchProvider>
          </AdminProvider>
        </NotificationProvider>
      </PreferencesProvider>
    </UserProvider>
  );
};

// Component that combines all contexts into one
const AppContextCombiner = ({ children }: { children: ReactNode }) => {
  const userContext = useUserContext();
  const matchContext = useMatchContext();
  const chatContext = useChatContext();

  // Combine all contexts into one
  const combinedContext: AppContextType = {
    // User context - mapeando user para currentUser
    currentUser: userContext.user,
    users: userContext.users,
    login: userContext.login,
    logout: userContext.logout,
    updateUserProfile: userContext.updateUserProfile,
    importPlayerStats: userContext.importPlayerStats,
    
    // Match context
    matches: matchContext.matches,
    createMatch: matchContext.createMatch,
    confirmPresence: matchContext.confirmPresence,
    cancelPresence: matchContext.cancelPresence,
    sortTeams: matchContext.sortTeams,
    recordMatchResult: matchContext.recordMatchResult,
    
    // Chat context
    chatMessages: chatContext.chatMessages,
    sendMessage: chatContext.sendMessage,
  };
  
  return (
    <AppContext.Provider value={combinedContext}>
      {children}
    </AppContext.Provider>
  );
};
