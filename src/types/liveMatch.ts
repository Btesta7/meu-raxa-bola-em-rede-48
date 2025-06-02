
export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: string;
  skillLevel?: number; // 1-5 para balanceamento
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  gradient: string;
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

export interface CompletedMatch {
  id: string;
  teamA: Team;
  teamB: Team;
  finalScore: { teamA: number; teamB: number };
  winner: Team;
  events: MatchEvent[];
  duration: number;
  timestamp: Date;
}

export interface MatchSession {
  id: string;
  confirmedPlayers: Player[];
  teams: Team[];
  currentMatch: {
    teamA: Team;
    teamB: Team;
    waitingTeam: Team;
    score: { teamA: number; teamB: number };
    events: MatchEvent[];
    timer: { seconds: number; isRunning: boolean; isPaused: boolean };
    winner: Team | null;
  } | null;
  matchHistory: CompletedMatch[];
}

export interface MatchState {
  phase: 'setup' | 'team-selection' | 'live-match' | 'match-ended';
  session: MatchSession;
}

export const TEAMS_CONFIG: Record<string, Omit<Team, 'players'>> = {
  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    shortName: 'BAR',
    color: '#A50044',
    secondaryColor: '#004D98',
    logo: '🔴',
    gradient: 'linear-gradient(45deg, #A50044, #004D98)'
  },
  realMadrid: {
    id: 'realMadrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    color: '#FFFFFF',
    secondaryColor: '#000000',
    logo: '⚪',
    gradient: 'linear-gradient(45deg, #FFFFFF, #E5E5E5)'
  },
  manchesterCity: {
    id: 'manchesterCity',
    name: 'Manchester City',
    shortName: 'MCI',
    color: '#6CABDD',
    secondaryColor: '#1C2C5B',
    logo: '🔵',
    gradient: 'linear-gradient(45deg, #6CABDD, #1C2C5B)'
  }
};

// Jogadores exemplo para demonstração
export const DEMO_PLAYERS: Player[] = [
  { id: '1', name: 'João Silva', skillLevel: 5 },
  { id: '2', name: 'Pedro Costa', skillLevel: 4 },
  { id: '3', name: 'Carlos Lima', skillLevel: 4 },
  { id: '4', name: 'Rafael Santos', skillLevel: 3 },
  { id: '5', name: 'Miguel Ramos', skillLevel: 5 },
  { id: '6', name: 'Lucas Oliveira', skillLevel: 3 },
  { id: '7', name: 'André Souza', skillLevel: 4 },
  { id: '8', name: 'Felipe Martins', skillLevel: 3 },
  { id: '9', name: 'Bruno Alves', skillLevel: 2 },
  { id: '10', name: 'Diego Ferreira', skillLevel: 4 },
  { id: '11', name: 'Thiago Rocha', skillLevel: 3 },
  { id: '12', name: 'Gabriel Pereira', skillLevel: 2 },
  { id: '13', name: 'Leonardo Cruz', skillLevel: 4 },
  { id: '14', name: 'Mateus Barbosa', skillLevel: 3 },
  { id: '15', name: 'Ricardo Gomes', skillLevel: 2 }
];

export function balancedTeamSort(players: Player[]): Team[] {
  const sortedPlayers = [...players].sort((a, b) => (b.skillLevel || 3) - (a.skillLevel || 3));
  
  // Adaptar número de times baseado na quantidade de jogadores
  let teamCount = 2; // Padrão: 2 times
  if (players.length >= 9) {
    teamCount = 3; // 3 times se tiver 9+ jogadores
  }
  
  console.log(`[DEBUG] Criando ${teamCount} times para ${players.length} jogadores`);
  
  const teams: Team[] = [
    { ...TEAMS_CONFIG.barcelona, players: [] },
    { ...TEAMS_CONFIG.realMadrid, players: [] }
  ];
  
  if (teamCount === 3) {
    teams.push({ ...TEAMS_CONFIG.manchesterCity, players: [] });
  }
  
  // Distribuição serpentina para balanceamento
  for (let i = 0; i < sortedPlayers.length; i++) {
    const teamIndex = Math.floor(i / teamCount) % 2 === 0 
      ? i % teamCount 
      : (teamCount - 1) - (i % teamCount);
    teams[teamIndex].players.push(sortedPlayers[i]);
  }
  
  return teams.filter(team => team.players.length > 0);
}

// Função auxiliar para validar se uma partida pode iniciar
export function canStartMatch(confirmedPlayers: Player[]): boolean {
  return confirmedPlayers.length >= 6; // Mínimo para 2 times de 3
}

// Função auxiliar para obter status da partida
export function getMatchStatus(confirmedPlayers: Player[]): string {
  if (confirmedPlayers.length < 6) {
    return `Aguardando jogadores (${confirmedPlayers.length}/6 mínimo)`;
  }
  return `Pronto para iniciar (${confirmedPlayers.length} jogadores)`;
}
