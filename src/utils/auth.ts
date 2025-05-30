
import { User } from '@/types';

const SESSION_KEY = 'meu-raxa-session';
const REMEMBER_KEY = 'meu-raxa-remember';

export const saveSession = (user: User, rememberMe: boolean = false) => {
  const sessionData = {
    user,
    timestamp: Date.now()
  };
  
  if (rememberMe) {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(sessionData));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }
};

export const getStoredSession = (): User | null => {
  try {
    // Primeiro tenta sessionStorage
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return parsed.user;
    }
    
    // Depois tenta localStorage
    const rememberData = localStorage.getItem(REMEMBER_KEY);
    if (rememberData) {
      const parsed = JSON.parse(rememberData);
      // Verifica se não passou de 30 dias
      const daysPassed = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
      if (daysPassed <= 30) {
        return parsed.user;
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao recuperar sessão:', error);
    return null;
  }
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};

export const generateAvatar = (name: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

