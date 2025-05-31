
import { Match, User, ChatMessage } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "carlos.silva@email.com",
    name: "Carlos Silva",
    position: "Goleiro",
    avatar: "https://i.pravatar.cc/150?img=1",
    stats: {
      goals: 0,
      assists: 0,
      matches: 15,
      wins: 8,
      attendance: 90,
      yellowCards: 1,
      redCards: 0
    },
    isAdmin: true, // Primeiro usuário é admin
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2025-05-29')
  },
  {
    id: "2",
    email: "rodrigo.oliveira@email.com",
    name: "Rodrigo Oliveira",
    position: "Atacante",
    avatar: "https://i.pravatar.cc/150?img=2",
    stats: {
      goals: 22,
      assists: 14,
      matches: 18,
      wins: 10,
      attendance: 85,
      yellowCards: 3,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date('2025-05-28')
  },
  {
    id: "3",
    email: "lucas.mendes@email.com",
    name: "Lucas Mendes",
    position: "Defensor",
    avatar: "https://i.pravatar.cc/150?img=3",
    stats: {
      goals: 3,
      assists: 5,
      matches: 20,
      wins: 12,
      attendance: 95,
      yellowCards: 4,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date('2025-05-27')
  },
  {
    id: "4",
    email: "bruno.santos@email.com",
    name: "Bruno Santos",
    position: "Meio-campista",
    avatar: "https://i.pravatar.cc/150?img=4",
    stats: {
      goals: 8,
      assists: 12,
      matches: 16,
      wins: 9,
      attendance: 80,
      yellowCards: 2,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2025-05-26')
  },
  {
    id: "5",
    email: "pedro.costa@email.com",
    name: "Pedro Costa",
    position: "Atacante",
    avatar: "https://i.pravatar.cc/150?img=5",
    stats: {
      goals: 17,
      assists: 8,
      matches: 19,
      wins: 11,
      attendance: 85,
      yellowCards: 5,
      redCards: 1
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-02-28'),
    lastLogin: new Date('2025-05-25')
  },
  {
    id: "6",
    email: "felipe.rocha@email.com",
    name: "Felipe Rocha",
    position: "Defensor",
    avatar: "https://i.pravatar.cc/150?img=6",
    stats: {
      goals: 2,
      assists: 3,
      matches: 17,
      wins: 10,
      attendance: 75,
      yellowCards: 6,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-03-12'),
    lastLogin: new Date('2025-05-24')
  },
  {
    id: "7",
    email: "andre.gomes@email.com",
    name: "André Gomes",
    position: "Meio-campista",
    avatar: "https://i.pravatar.cc/150?img=7",
    stats: {
      goals: 12,
      assists: 15,
      matches: 20,
      wins: 13,
      attendance: 100,
      yellowCards: 1,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-01-30'),
    lastLogin: new Date('2025-05-23')
  },
  {
    id: "8",
    email: "joao.paulo@email.com",
    name: "João Paulo",
    position: "Goleiro",
    avatar: "https://i.pravatar.cc/150?img=8",
    stats: {
      goals: 0,
      assists: 0,
      matches: 14,
      wins: 7,
      attendance: 70,
      yellowCards: 0,
      redCards: 0
    },
    isAdmin: false,
    isActive: true,
    isProfileComplete: true,
    createdAt: new Date('2024-04-02'),
    lastLogin: new Date('2025-05-22')
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

