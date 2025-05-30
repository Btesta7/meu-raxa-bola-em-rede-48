
# API e Serviços - Meu Raxa

## 📡 Visão Geral da API

O Meu Raxa utiliza uma arquitetura baseada em Context API para gerenciamento de estado e serviços simulados para desenvolvimento. Este documento descreve como os dados fluem pela aplicação.

## 🔧 Serviços Principais

### AuthService
Gerencia autenticação e autorização de usuários.

```typescript
interface AuthService {
  login(credentials: AuthCredentials): Promise<{ user: User; token: string }>;
  register(userData: RegisterData): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  validateToken(token: string): Promise<boolean>;
}
```

#### Métodos Disponíveis
- `login()`: Autentica usuário com email/senha
- `register()`: Cria nova conta de usuário
- `logout()`: Termina sessão do usuário
- `resetPassword()`: Envia email de recuperação
- `validateToken()`: Valida token de autenticação

### UserService
Gerencia dados e perfil do usuário.

```typescript
interface UserService {
  getCurrentUser(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
  uploadAvatar(file: File): Promise<string>;
  updatePreferences(preferences: UserPreferences): Promise<void>;
  getStats(userId: string): Promise<UserStats>;
}
```

#### Métodos Disponíveis
- `getCurrentUser()`: Retorna dados do usuário logado
- `updateProfile()`: Atualiza dados do perfil
- `uploadAvatar()`: Faz upload de foto de perfil
- `updatePreferences()`: Salva preferências do usuário
- `getStats()`: Retorna estatísticas do jogador

### MatchService
Gerencia partidas e participações.

```typescript
interface MatchService {
  getMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match>;
  createMatch(data: CreateMatchData): Promise<Match>;
  updateMatch(id: string, data: Partial<Match>): Promise<Match>;
  confirmPresence(matchId: string, userId: string): Promise<void>;
  cancelPresence(matchId: string, userId: string): Promise<void>;
  drawTeams(matchId: string): Promise<{ teamA: User[]; teamB: User[] }>;
}
```

#### Métodos Disponíveis
- `getMatches()`: Lista todas as partidas
- `getMatch()`: Retorna detalhes de uma partida
- `createMatch()`: Cria nova partida (admin)
- `updateMatch()`: Atualiza dados da partida
- `confirmPresence()`: Confirma participação
- `cancelPresence()`: Cancela participação
- `drawTeams()`: Sorteia times automaticamente

## 📊 Estruturas de Dados

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
  phone?: string;
  secondaryPositions?: PlayerPosition[];
  preferredFoot?: 'right' | 'left' | 'both';
  emergencyContact?: EmergencyContact;
  preferences?: UserPrivacyPreferences;
  isProfileComplete?: boolean;
}
```

### Match
```typescript
interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  confirmedPlayers: User[];
  teams?: {
    teamA: User[];
    teamB: User[];
  };
  status: "scheduled" | "completed" | "canceled";
  result?: {
    teamAScore: number;
    teamBScore: number;
  };
  createdBy: string;
  createdAt: string;
}
```

### UserStats
```typescript
interface UserStats {
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  winRate: number;
  averageRating: number;
}
```

## 🔄 Context API Structure

### UserContext
Gerencia estado de autenticação e dados do usuário.

```typescript
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}
```

### MatchContext
Gerencia estado das partidas.

```typescript
interface MatchContextType {
  matches: Match[];
  currentMatch: Match | null;
  isLoading: boolean;
  createMatch: (data: CreateMatchData) => Promise<void>;
  confirmPresence: (matchId: string) => Promise<void>;
  cancelPresence: (matchId: string) => Promise<void>;
  drawTeams: (matchId: string) => Promise<void>;
}
```

### PreferencesContext
Gerencia configurações do usuário.

```typescript
interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}
```

## 🔔 Sistema de Notificações

### NotificationService
```typescript
interface NotificationService {
  getNotifications(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  sendNotification(data: CreateNotificationData): Promise<void>;
}
```

### Tipos de Notificação
- **MATCH_REMINDER**: Lembrete de partida
- **MATCH_CANCELED**: Partida cancelada
- **TEAM_DRAWN**: Times sorteados
- **PLAYER_JOINED**: Jogador confirmou presença
- **PLAYER_LEFT**: Jogador cancelou presença

## 📝 Sistema de Auditoria

### AuditService
Registra ações importantes do usuário.

```typescript
interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

### Ações Auditadas
- **LOGIN**: Login de usuário
- **LOGOUT**: Logout de usuário
- **PROFILE_UPDATE**: Atualização de perfil
- **MATCH_CREATE**: Criação de partida
- **MATCH_JOIN**: Participação em partida
- **MATCH_LEAVE**: Saída de partida

## 🔧 Utilitários e Helpers

### Validation Utils
```typescript
// utils/validation.ts
export const validateEmail = (email: string): boolean => { /* ... */ };
export const validatePassword = (password: string): boolean => { /* ... */ };
export const validatePhone = (phone: string): boolean => { /* ... */ };
```

### Auth Utils
```typescript
// utils/auth.ts
export const getToken = (): string | null => { /* ... */ };
export const setToken = (token: string): void => { /* ... */ };
export const removeToken = (): void => { /* ... */ };
export const isTokenValid = (token: string): boolean => { /* ... */ };
```

### Date Utils
```typescript
// utils/date.ts
export const formatDate = (date: Date, format: string): string => { /* ... */ };
export const isToday = (date: Date): boolean => { /* ... */ };
export const isUpcoming = (date: Date): boolean => { /* ... */ };
```

## 🚀 TanStack React Query

### Query Keys
```typescript
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  matches: ['matches'] as const,
  match: (id: string) => ['matches', id] as const,
  stats: (userId: string) => ['stats', userId] as const,
  notifications: ['notifications'] as const,
};
```

### Queries Principais
```typescript
// hooks/useMatches.ts
export const useMatches = () => {
  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: () => matchService.getMatches(),
  });
};

// hooks/useUser.ts
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUser(id),
  });
};
```

### Mutations
```typescript
// hooks/useCreateMatch.ts
export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMatchData) => matchService.createMatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches });
    },
  });
};
```

## 🔒 Autenticação e Autorização

### JWT Token Structure
```typescript
interface JWTPayload {
  sub: string; // user id
  email: string;
  role: 'user' | 'admin';
  iat: number; // issued at
  exp: number; // expires at
}
```

### Route Protection
```typescript
// components/ProtectedRoute.tsx
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useUserContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

## 📊 Import/Export de Dados

### CSV Import Service
```typescript
interface ImportService {
  importStats(file: File): Promise<ImportResult>;
  exportStats(userId: string): Promise<Blob>;
  validateCSV(file: File): Promise<ValidationResult>;
}
```

### Formato CSV Esperado
```csv
date,goals,assists,minutes_played,yellow_cards,red_cards
2024-01-15,2,1,90,0,0
2024-01-22,0,2,85,1,0
```

## 🔮 Futuras Integrações

### Weather API
```typescript
interface WeatherService {
  getWeatherForMatch(matchId: string): Promise<WeatherData>;
  getWeatherForecast(location: string, date: string): Promise<WeatherData>;
}
```

### Maps API
```typescript
interface MapsService {
  geocodeLocation(address: string): Promise<Coordinates>;
  getDirections(from: Coordinates, to: Coordinates): Promise<Route>;
}
```

### Push Notifications
```typescript
interface PushNotificationService {
  subscribe(userId: string, subscription: PushSubscription): Promise<void>;
  sendNotification(userId: string, notification: PushNotificationData): Promise<void>;
}
```

## 🛠️ Desenvolvimento e Debug

### Mock Data
Durante o desenvolvimento, todos os serviços utilizam dados mock definidos em `src/data/mockData.ts`.

### Console Logging
```typescript
// Logs estruturados para debug
console.log('[AUTH]', 'User logged in:', user);
console.log('[MATCH]', 'Match created:', match);
console.log('[ERROR]', 'API Error:', error);
```

### Error Handling
```typescript
// Padrão de tratamento de erros
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API Error:', error);
  throw new Error('Operação falhou. Tente novamente.');
}
```

## 📈 Performance e Otimização

### Cache Strategy
- **Static Data**: Cache infinito para dados que não mudam
- **User Data**: Cache por 5 minutos
- **Match Data**: Cache por 1 minuto para dados em tempo real

### Lazy Loading
```typescript
// Carregamento sob demanda de páginas
const Stats = lazy(() => import('./pages/Stats'));
const Profile = lazy(() => import('./pages/Profile'));
```

Essa documentação serve como referência para entender como os dados fluem na aplicação e como implementar novas funcionalidades seguindo os padrões estabelecidos.
