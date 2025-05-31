
export interface Team {
  id: string;
  name: string;
  players: string[];
}

export interface LiveMatchEvent {
  id: string;
  type: 'goal' | 'assist';
  playerId: string;
  playerName: string;
  teamId: string;
  timestamp: number;
  minute: number;
}

export interface LiveMatchData {
  id: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  events: LiveMatchEvent[];
  duration: number; // in seconds (7 minutes = 420 seconds)
  isActive: boolean;
  isPaused: boolean;
  startTime?: number;
}

export const TEAMS = {
  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    players: ['Messi', 'Xavi', 'Iniesta', 'Puyol', 'Dani Alves', 'Busquets']
  },
  realMadrid: {
    id: 'realMadrid',
    name: 'Real Madrid',
    players: ['Ronaldo', 'Benzema', 'Modric', 'Ramos', 'Marcelo', 'Casemiro']
  },
  manchesterCity: {
    id: 'manchesterCity',
    name: 'Manchester City',
    players: ['De Bruyne', 'Haaland', 'Silva', 'Walker', 'Stones', 'Rodri']
  }
};
