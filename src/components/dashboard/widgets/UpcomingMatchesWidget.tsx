
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, X, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardWidget } from '@/types/preferences';
import { useAppContext } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UpcomingMatchesWidgetProps {
  widget: DashboardWidget;
  isCustomizing: boolean;
  onRemove: () => void;
  onResize: (size: 'small' | 'medium' | 'large') => void;
}

const UpcomingMatchesWidget: React.FC<UpcomingMatchesWidgetProps> = ({
  widget,
  isCustomizing,
  onRemove,
  onResize
}) => {
  const { matches } = useAppContext();
  
  const upcomingMatches = matches
    .filter(match => match.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, widget.size === 'small' ? 2 : widget.size === 'medium' ? 3 : 5);

  const getTimeUntilMatch = (date: string, time: string) => {
    const matchDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = matchDateTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Já passou';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `em ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `em ${hours}h`;
    return 'hoje';
  };

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
          {upcomingMatches.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma partida agendada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border bg-gradient-to-r from-gray-50 to-white hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium text-gray-900">
                          {format(new Date(match.date), 'dd MMM', { locale: ptBR })}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getTimeUntilMatch(match.date, match.time)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {match.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {match.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {match.confirmedPlayers.length}/{match.maxPlayers}
                    </div>
                  </div>
                  
                  {widget.size === 'large' && (
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {match.confirmedPlayers.slice(0, 3).map((player, playerIndex) => (
                          <div
                            key={player.id}
                            className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                            title={player.name}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {match.confirmedPlayers.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white">
                            +{match.confirmedPlayers.length - 3}
                          </div>
                        )}
                      </div>
                      
                      <Badge 
                        variant={match.confirmedPlayers.length === match.maxPlayers ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {match.confirmedPlayers.length === match.maxPlayers ? 'Lotado' : 'Vagas Disponíveis'}
                      </Badge>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingMatchesWidget;
