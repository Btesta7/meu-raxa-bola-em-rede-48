import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Notification } from '@/types/notifications';
import { NotificationType, NotificationSettings } from '@/types/notifications';
import { useUserContext } from './UserContext';
import { toast } from '@/components/ui/sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  requestPushPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

const defaultSettings: NotificationSettings = {
  userId: '',
  enablePush: false,
  enableEmail: false,
  types: {
    [NotificationType.MATCH_CREATED]: true,
    [NotificationType.MATCH_CANCELED]: true,
    [NotificationType.MATCH_UPDATED]: true,
    [NotificationType.TEAMS_DRAWN]: true,
    [NotificationType.MATCH_REMINDER]: true,
    [NotificationType.NEW_PLAYER]: true,
    [NotificationType.CHAT_MESSAGE]: false,
    [NotificationType.PROFILE_UPDATED]: true,
    [NotificationType.SYSTEM_ANNOUNCEMENT]: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    if (user) {
      // Carregar configurações e notificações do usuário
      const savedSettings = localStorage.getItem(`notifications_settings_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings({ ...defaultSettings, userId: user.id });
      }

      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
        }));
        setNotifications(parsed);
      }
    }
  }, [user]);

  const saveNotifications = (newNotifications: Notification[]) => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    if (user) {
      localStorage.setItem(`notifications_settings_${user.id}`, JSON.stringify(newSettings));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      createdAt: new Date(),
    };

    // Verificar se o tipo de notificação está habilitado
    if (!settings.types[notification.type]) return;

    // Verificar horário silencioso
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = settings.quietHours;
      
      if (start <= end) {
        if (currentTime >= start && currentTime <= end) return;
      } else {
        if (currentTime >= start || currentTime <= end) return;
      }
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveNotifications(updated);
      return updated;
    });

    // Show push notification if enabled
    if (settings.enablePush && 'Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }

    // Show toast for high priority notifications
    if (notification.priority === 'high') {
      toast.info(notification.title, {
        description: notification.message,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotifications(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações push');
      return false;
    }

    if (window.Notification.permission === 'granted') {
      return true;
    }

    if (window.Notification.permission === 'denied') {
      toast.error('Notificações foram bloqueadas. Habilite nas configurações do navegador.');
      return false;
    }

    const permission = await window.Notification.requestPermission();
    const granted = permission === 'granted';
    
    if (granted) {
      toast.success('Notificações habilitadas com sucesso!');
      updateSettings({ enablePush: true });
    } else {
      toast.error('Permissão para notificações negada');
    }

    return granted;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    requestPushPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
