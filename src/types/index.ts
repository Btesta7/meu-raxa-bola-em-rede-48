export interface User {
  id: string;
  email: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  phone?: string;
  secondaryPositions?: PlayerPosition[];
  preferredFoot?: 'right' | 'left' | 'both';
  yearsPlaying?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
  };
  isProfileComplete?: boolean;
  onboardingStep?: number;
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

// NOVAS INTERFACES PARA FASE 2
export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  age: number | null;
  bio: string;
  position: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  preferredFoot: 'right' | 'left' | 'both';
  yearsPlaying: number | null;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
  };
}

export interface AvatarUpload {
  file: File;
  preview: string;
  isUploading: boolean;
  error?: string;
}

// NOVAS INTERFACES PARA ONBOARDING
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isComplete: boolean;
}

export interface OnboardingData {
  // Informações básicas (Step 1)
  name: string;
  age: number | null;
  phone: string;
  
  // Informações de futebol (Step 2)
  position: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  preferredFoot: 'right' | 'left' | 'both';
  yearsPlaying: number | null;
  
  // Avatar e finalização (Step 3)
  avatar?: File;
  bio: string;
  
  // Contato de emergência (Step 4)
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface UserContextType extends AuthState {
  users: User[];
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isEmailAvailable: (email: string) => boolean;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateUserStats: (userId: string, updates: Partial<User['stats']>) => void;
  importPlayerStats: (stats: ImportedStats[]) => void;
  clearError: () => void;
  isNewUser: boolean;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
  saveOnboardingStep: (step: number, data: Partial<OnboardingData>) => Promise<boolean>;
}

export * from './notifications';
export * from './audit';
export * from './dashboard';
export * from './passwordReset';
export { };
