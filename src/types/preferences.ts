
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    matchReminders: boolean;
    teamUpdates: boolean;
    chatMessages: boolean;
    systemAnnouncements: boolean;
  };
  dashboardLayout: DashboardWidget[];
  onboardingCompleted: boolean;
  language: string;
  timezone: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: 'small' | 'medium' | 'large';
  position: { row: number; col: number; };
  data?: any;
  refreshInterval?: number;
  isVisible: boolean;
}

export enum WidgetType {
  PERSONAL_STATS = 'personal_stats',
  UPCOMING_MATCHES = 'upcoming_matches', 
  RECENT_ACTIVITY = 'recent_activity',
  PERFORMANCE_CHART = 'performance_chart',
  NOTIFICATIONS = 'notifications',
  QUICK_ACTIONS = 'quick_actions',
  TEAM_MEMBERS = 'team_members',
  CALENDAR = 'calendar'
}
