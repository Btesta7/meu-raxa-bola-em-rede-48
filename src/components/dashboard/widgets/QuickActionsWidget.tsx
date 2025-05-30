
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, MessageCircle, X, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardWidget } from '@/types/preferences';
import { useNavigate } from 'react-router-dom';

interface QuickActionsWidgetProps {
  widget: DashboardWidget;
  isCustomizing: boolean;
  onRemove: () => void;
  onResize: (size: 'small' | 'medium' | 'large') => void;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  widget,
  isCustomizing,
  onRemove,
  onResize
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'create-match',
      title: 'Nova Partida',
      description: 'Criar uma nova partida',
      icon: Plus,
      color: 'bg-primary text-white hover:bg-primary/90',
      onClick: () => navigate('/?create=true')
    },
    {
      id: 'view-players',
      title: 'Jogadores',
      description: 'Ver lista de jogadores',
      icon: Users,
      color: 'bg-blue-500 text-white hover:bg-blue-600',
      onClick: () => navigate('/players')
    },
    {
      id: 'view-matches',
      title: 'Agenda',
      description: 'Ver próximas partidas',
      icon: Calendar,
      color: 'bg-green-500 text-white hover:bg-green-600',
      onClick: () => navigate('/')
    },
    {
      id: 'open-chat',
      title: 'Chat',
      description: 'Conversar com o grupo',
      icon: MessageCircle,
      color: 'bg-purple-500 text-white hover:bg-purple-600',
      onClick: () => navigate('/chat')
    }
  ];

  const visibleActions = widget.size === 'small' 
    ? actions.slice(0, 2) 
    : widget.size === 'medium' 
    ? actions.slice(0, 3) 
    : actions;

  return (
    <motion.div
      whileHover={isCustomizing ? { scale: 1.02 } : {}}
      className="relative"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-medium">{widget.title}</CardTitle>
          {isCustomizing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResize(widget.size === 'large' ? 'medium' : 'large')}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className={`grid gap-3 ${
            widget.size === 'large' 
              ? 'grid-cols-2' 
              : 'grid-cols-1'
          }`}>
            {visibleActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={action.onClick}
                  className={`w-full h-auto p-4 ${action.color} border-0 text-left flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{action.title}</div>
                    {widget.size !== 'small' && (
                      <div className="text-sm opacity-90 truncate">
                        {action.description}
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {widget.size === 'large' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t"
            >
              <p className="text-xs text-gray-500 text-center">
                Acesse rapidamente as principais funcionalidades
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsWidget;
