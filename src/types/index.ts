export interface User {
  id: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean; // novo campo para identificar administradores
  age?: number; // novo campo para idade
  bio?: string; // novo campo para biografia
}

export type PlayerPosition = 
  | "Goleiro" 
  | "Defensor" 
  | "Meio-campista" 
  | "Atacante";

export interface UserStats {
  goals: number;
  assists: number; // novo campo de assistências
  matches: number;
  wins: number;
  attendance: number; // percentage
  yellowCards: number; // novo campo de cartões amarelos
  redCards: number; // novo campo de cartões vermelhos
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
