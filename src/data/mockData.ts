
import { Match, User, ChatMessage } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos Silva",
    position: "Goleiro",
    avatar: "https://i.pravatar.cc/150?img=1",
    stats: {
      goals: 0,
      matches: 15,
      wins: 8,
      attendance: 90
    }
  },
  {
    id: "2",
    name: "Rodrigo Oliveira",
    position: "Atacante",
    avatar: "https://i.pravatar.cc/150?img=2",
    stats: {
      goals: 22,
      matches: 18,
      wins: 10,
      attendance: 85
    }
  },
  {
    id: "3",
    name: "Lucas Mendes",
    position: "Defensor",
    avatar: "https://i.pravatar.cc/150?img=3",
    stats: {
      goals: 3,
      matches: 20,
      wins: 12,
      attendance: 95
    }
  },
  {
    id: "4",
    name: "Bruno Santos",
    position: "Meio-campista",
    avatar: "https://i.pravatar.cc/150?img=4",
    stats: {
      goals: 8,
      matches: 16,
      wins: 9,
      attendance: 80
    }
  },
  {
    id: "5",
    name: "Pedro Costa",
    position: "Atacante",
    avatar: "https://i.pravatar.cc/150?img=5",
    stats: {
      goals: 17,
      matches: 19,
      wins: 11,
      attendance: 85
    }
  },
  {
    id: "6",
    name: "Felipe Rocha",
    position: "Defensor",
    avatar: "https://i.pravatar.cc/150?img=6",
    stats: {
      goals: 2,
      matches: 17,
      wins: 10,
      attendance: 75
    }
  },
  {
    id: "7",
    name: "André Gomes",
    position: "Meio-campista",
    avatar: "https://i.pravatar.cc/150?img=7",
    stats: {
      goals: 12,
      matches: 20,
      wins: 13,
      attendance: 100
    }
  },
  {
    id: "8",
    name: "João Paulo",
    position: "Goleiro",
    avatar: "https://i.pravatar.cc/150?img=8",
    stats: {
      goals: 0,
      matches: 14,
      wins: 7,
      attendance: 70
    }
  }
];

export const mockMatches: Match[] = [
  {
    id: "1",
    date: "2025-05-10",
    time: "19:00",
    location: "Quadra do Parque",
    maxPlayers: 10,
    confirmedPlayers: mockUsers.slice(0, 8),
    status: "scheduled"
  },
  {
    id: "2",
    date: "2025-05-17",
    time: "18:30",
    location: "Arena Futsal",
    maxPlayers: 14,
    confirmedPlayers: mockUsers.slice(0, 5),
    status: "scheduled"
  },
  {
    id: "3",
    date: "2025-05-03",
    time: "20:00",
    location: "Quadra do Parque",
    maxPlayers: 10,
    confirmedPlayers: mockUsers,
    teams: {
      teamA: mockUsers.slice(0, 4),
      teamB: mockUsers.slice(4, 8)
    },
    status: "completed",
    result: {
      teamAScore: 3,
      teamBScore: 2
    }
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "2",
    userName: "Rodrigo Oliveira",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    message: "Pessoal, vamos confirmar presença para sábado?",
    timestamp: "2025-05-05T14:32:00"
  },
  {
    id: "2",
    userId: "3",
    userName: "Lucas Mendes",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    message: "Confirmado! Vou levar mais 1 colega.",
    timestamp: "2025-05-05T14:35:00"
  },
  {
    id: "3",
    userId: "1",
    userName: "Carlos Silva",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    message: "Estarei lá, vou levar água para todos.",
    timestamp: "2025-05-05T14:40:00"
  },
  {
    id: "4",
    userId: "4",
    userName: "Bruno Santos",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    message: "Tenho um colibri. Posso levar?",
    timestamp: "2025-05-05T14:42:00"
  }
];
