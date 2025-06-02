export interface MatchSchedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  maxPlayers: number;
  description?: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  createdBy: string; // ID do admin
  createdAt: Date;
  confirmedPlayers: string[]; // IDs dos jogadores
  waitingList: string[]; // Lista de espera
  teams?: {
    teamA: any[];
    teamB: any[];
  };
  result?: {
    teamAScore: number;
    teamBScore: number;
  };
}

export interface PlayerConfirmation {
  matchId: string;
  playerId: string;
  status: 'confirmed' | 'cancelled' | 'waiting';
  confirmedAt: Date;
  position?: string; // Posição preferida para a partida
}

export interface CreateMatchData {
  title: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  description?: string;
}

export interface AdminContextType {
  isAdmin: boolean;
  scheduledMatches: MatchSchedule[];
  createMatch: (matchData: CreateMatchData) => Promise<void>;
  updateMatch: (matchId: string, updates: Partial<MatchSchedule>) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  getMatchConfirmations: (matchId: string) => Promise<PlayerConfirmation[]>;
  confirmPlayerAttendance: (matchId: string, playerId: string) => Promise<void>;
  cancelPlayerAttendance: (matchId: string, playerId: string) => Promise<void>;
}
