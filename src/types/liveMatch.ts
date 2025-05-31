
export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  players: Player[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'assist';
  playerId: string;
  playerName: string;
  team: string;
  teamId: string;
  minute: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  timestamp: Date;
}

export interface MatchState {
  teamA: Team | null;
  teamB: Team | null;
  score: {
    teamA: number;
    teamB: number;
  };
  timer: {
    seconds: number;
    isRunning: boolean;
    isPaused: boolean;
  };
  events: MatchEvent[];
  isMatchStarted: boolean;
  pendingAssist: {
    goalEvent: MatchEvent | null;
    isWaiting: boolean;
  };
}

export const TEAMS: Record<string, Team> = {
  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    color: '#A50044',
    players: [
      { id: '1', name: 'Messi', number: 10 },
      { id: '2', name: 'Pedri', number: 8 },
      { id: '3', name: 'Gavi', number: 6 },
      { id: '4', name: 'Lewandowski', number: 9 },
      { id: '5', name: 'Raphinha', number: 11 }
    ]
  },
  realMadrid: {
    id: 'realMadrid',
    name: 'Real Madrid',
    color: '#FFFFFF',
    players: [
      { id: '6', name: 'Benzema', number: 9 },
      { id: '7', name: 'Modrić', number: 10 },
      { id: '8', name: 'Kroos', number: 8 },
      { id: '9', name: 'Vinicius Jr.', number: 7 },
      { id: '10', name: 'Rodrygo', number: 11 }
    ]
  },
  manchesterCity: {
    id: 'manchesterCity',
    name: 'Manchester City',
    color: '#6CABDD',
    players: [
      { id: '11', name: 'Haaland', number: 9 },
      { id: '12', name: 'De Bruyne', number: 17 },
      { id: '13', name: 'Bernardo Silva', number: 20 },
      { id: '14', name: 'Grealish', number: 10 },
      { id: '15', name: 'Mahrez', number: 26 }
    ]
  }
};
