
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PROFILE_UPDATE = 'profile_update',
  AVATAR_UPLOAD = 'avatar_upload',
  MATCH_CREATE = 'match_create',
  MATCH_UPDATE = 'match_update',
  MATCH_DELETE = 'match_delete',
  PRESENCE_CONFIRM = 'presence_confirm',
  PASSWORD_RESET = 'password_reset',
  PERMISSION_CHANGE = 'permission_change'
}

export interface AuditFilters {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ActivityStats {
  totalActions: number;
  actionsToday: number;
  topUsers: Array<{ userId: string; userName: string; actionCount: number }>;
  actionsByType: Array<{ action: AuditAction; count: number }>;
}
