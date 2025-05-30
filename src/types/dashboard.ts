
export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: 'small' | 'medium' | 'large';
  position: { row: number; col: number; };
  data?: any;
  refreshInterval?: number;
}

export enum WidgetType {
  NEXT_MATCHES = 'next_matches',
  PERSONAL_STATS = 'personal_stats',
  RECENT_ACTIVITY = 'recent_activity',
  PERFORMANCE_CHART = 'performance_chart',
  NOTIFICATIONS = 'notifications',
  CALENDAR = 'calendar',
  QUICK_ACTIONS = 'quick_actions',
  TEAM_MEMBERS = 'team_members'
}
