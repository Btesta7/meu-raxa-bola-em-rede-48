import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuditLog, AuditAction, AuditFilters, ActivityStats } from '@/types/audit';
import { useUserContext } from './UserContext';

interface AuditContextType {
  logs: AuditLog[];
  logAction: (action: AuditAction, resource: string, details?: any, resourceId?: string) => void;
  getLogs: (filters?: AuditFilters) => AuditLog[];
  exportLogs: (filters?: AuditFilters) => void;
  getActivityStats: () => ActivityStats;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  return context;
};

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const logAction = (action: AuditAction, resource: string, details: any = {}, resourceId?: string) => {
    if (!user) return;

    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      action,
      resource,
      resourceId,
      details,
      ipAddress: '127.0.0.1', // Simulated
      userAgent: navigator.userAgent,
      timestamp: new Date(),
    };

    setLogs(prev => {
      const updated = [newLog, ...prev];
      // Keep only last 1000 logs for performance
      if (updated.length > 1000) {
        updated.splice(1000);
      }
      
      // Save to localStorage
      localStorage.setItem('audit_logs', JSON.stringify(updated));
      return updated;
    });

    console.log('Audit Log:', newLog);
  };

  // Register audit logger with UserContext
  useEffect(() => {
    if ((window as any).setUserContextAuditLogger) {
      (window as any).setUserContextAuditLogger(logAction);
    }
  }, [user]);

  const getLogs = (filters?: AuditFilters): AuditLog[] => {
    let filteredLogs = [...logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => 
          log.resource.toLowerCase().includes(filters.resource!.toLowerCase())
        );
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    return filteredLogs;
  };

  const exportLogs = (filters?: AuditFilters) => {
    const logsToExport = getLogs(filters);
    
    const csvHeaders = ['Timestamp', 'User', 'Action', 'Resource', 'Details'];
    const csvRows = logsToExport.map(log => [
      log.timestamp.toISOString(),
      `${log.userName} (${log.userEmail})`,
      log.action,
      log.resource,
      JSON.stringify(log.details),
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActivityStats = (): ActivityStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const actionsToday = logs.filter(log => log.timestamp >= today).length;

    const userStats = logs.reduce((acc, log) => {
      if (!acc[log.userId]) {
        acc[log.userId] = { userId: log.userId, userName: log.userName, actionCount: 0 };
      }
      acc[log.userId].actionCount++;
      return acc;
    }, {} as Record<string, { userId: string; userName: string; actionCount: number }>);

    const topUsers = Object.values(userStats)
      .sort((a, b) => b.actionCount - a.actionCount)
      .slice(0, 5);

    const actionStats = logs.reduce((acc, log) => {
      if (!acc[log.action]) {
        acc[log.action] = 0;
      }
      acc[log.action]++;
      return acc;
    }, {} as Record<AuditAction, number>);

    const actionsByType = Object.entries(actionStats).map(([action, count]) => ({
      action: action as AuditAction,
      count,
    }));

    return {
      totalActions: logs.length,
      actionsToday,
      topUsers,
      actionsByType,
    };
  };

  // Load logs from localStorage on mount
  React.useEffect(() => {
    const savedLogs = localStorage.getItem('audit_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(parsed);
      } catch (error) {
        console.error('Error loading audit logs:', error);
      }
    }
  }, []);

  const value = {
    logs,
    logAction,
    getLogs,
    exportLogs,
    getActivityStats,
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
};
