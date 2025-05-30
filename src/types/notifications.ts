
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  MATCH_CREATED = 'match_created',
  MATCH_CANCELED = 'match_canceled',
  MATCH_UPDATED = 'match_updated',
  TEAMS_DRAWN = 'teams_drawn',
  MATCH_REMINDER = 'match_reminder',
  NEW_PLAYER = 'new_player',
  CHAT_MESSAGE = 'chat_message',
  PROFILE_UPDATED = 'profile_updated',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export interface NotificationSettings {
  userId: string;
  enablePush: boolean;
  enableEmail: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
