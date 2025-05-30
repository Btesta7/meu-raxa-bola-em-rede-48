
import React, { createContext, useContext, ReactNode } from 'react';
import { UserProvider, useUserContext } from './UserContext';
import { MatchProvider, useMatchContext } from './MatchContext';
import { ChatProvider, useChatContext } from './ChatContext';

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

// Combined provider that wraps all subproviders
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <UserConsumer>
        {(userContext) => (
          <MatchProvider>
            <MatchConsumer>
              {(matchContext) => (
                <ChatProvider>
                  <ChatConsumer>
                    {(chatContext) => {
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
                    }}
                  </ChatConsumer>
                </ChatProvider>
              )}
            </MatchConsumer>
          </MatchProvider>
        )}
      </UserConsumer>
    </UserProvider>
  );
};

// Consumer components to help with the nested provider pattern
const UserConsumer = ({ children }: { children: (context: ReturnType<typeof useUserContext>) => React.ReactNode }) => {
  const context = useUserContext();
  return <>{children(context)}</>;
};

const MatchConsumer = ({ children }: { children: (context: ReturnType<typeof useMatchContext>) => React.ReactNode }) => {
  const context = useMatchContext();
  return <>{children(context)}</>;
};

const ChatConsumer = ({ children }: { children: (context: ReturnType<typeof useChatContext>) => React.ReactNode }) => {
  const context = useChatContext();
  return <>{children(context)}</>;
};
