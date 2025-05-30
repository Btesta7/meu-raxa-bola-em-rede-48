
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, TrendingUp, X, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardWidget } from '@/types/preferences';
import { useUserContext } from '@/contexts/UserContext';

interface PersonalStatsWidgetProps {
  widget: DashboardWidget;
  isCustomizing: boolean;
  onRemove: () => void;
  onResize: (size: 'small' | 'medium' | 'large') => void;
}

const PersonalStatsWidget: React.FC<PersonalStatsWidgetProps> = ({
  widget,
  isCustomizing,
  onRemove,
  onResize
}) => {
  const { user } = useUserContext();
  
  if (!user) return null;

  const { stats } = user;
  const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;

  const statsData = [
    {
      label: 'Gols',
      value: stats.goals,
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Assistências',
      value: stats.assists,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Partidas',
      value: stats.matches,
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Taxa de Vitória',
      value: `${winRate}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

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
          {widget.size === 'large' ? (
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {statsData.slice(0, widget.size === 'small' ? 2 : 4).map((stat, index) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {stat.value}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Performance Indicator */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Performance Geral</span>
              <Badge variant={winRate >= 70 ? "default" : winRate >= 50 ? "secondary" : "destructive"}>
                {winRate >= 70 ? "Excelente" : winRate >= 50 ? "Boa" : "Em Desenvolvimento"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalStatsWidget;
