
export interface User {
  id: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
}

export type PlayerPosition = 
  | "Goleiro" 
  | "Defensor" 
  | "Meio-campista" 
  | "Atacante";

export interface UserStats {
  goals: number;
  matches: number;
  wins: number;
  attendance: number; // percentage
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
