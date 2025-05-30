
export interface User {
  id: string;
  email: string; // NOVO CAMPO
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
  createdAt: Date; // NOVO CAMPO
  lastLogin?: Date; // NOVO CAMPO
  isActive: boolean; // NOVO CAMPO
}

export type PlayerPosition = 
  | "Goleiro" 
  | "Defensor" 
  | "Meio-campista" 
  | "Atacante";

export interface UserStats {
  goals: number;
  assists: number;
  matches: number;
  wins: number;
  attendance: number;
  yellowCards: number;
  redCards: number;
}

export interface Match {
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
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
}

// Interface para estatísticas importadas do PDF
export interface ImportedStats {
  name: string;
  position?: PlayerPosition;
  goals?: number;
  assists?: number;
  matches?: number;
  wins?: number;
  attendance?: number;
  yellowCards?: number;
  redCards?: number;
}

// NOVAS INTERFACES PARA AUTENTICAÇÃO
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  position: PlayerPosition;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

