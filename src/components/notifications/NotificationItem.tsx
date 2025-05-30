
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Trash2, ExternalLink } from 'lucide-react';
import { Notification } from '@/types/notifications';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClose 
}) => {
  const { markAsRead, deleteNotification } = useNotificationContext();
  const navigate = useNavigate();

  const handleMarkAsRead = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    deleteNotification(notification.id);
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      handleMarkAsRead();
      navigate(notification.actionUrl);
      onClose?.();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const timeAgo = formatDistanceToNow(notification.createdAt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            )}
            <Badge 
              variant={getPriorityColor(notification.priority)} 
              className="text-xs flex-shrink-0"
            >
              {notification.priority}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {timeAgo}
            </span>
            
            {notification.actionUrl && notification.actionLabel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAction}
                className="text-xs h-6 px-2"
              >
                <ExternalLink size={12} className="mr-1" />
                {notification.actionLabel}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              className="h-6 w-6 p-0"
            >
              <Check size={12} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
};
