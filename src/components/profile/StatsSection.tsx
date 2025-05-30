
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Users, Award, Calendar, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  user: User;
}

const StatsSection: React.FC<StatsSectionProps> = ({ user }) => {
  const { stats } = user;
  
  const calculateWinRate = () => {
    if (stats.matches === 0) return 0;
    return Math.round((stats.wins / stats.matches) * 100);
  };

  const calculateGoalsPerMatch = () => {
    if (stats.matches === 0) return 0;
    return (stats.goals / stats.matches).toFixed(1);
  };

  const statsCards = [
    {
      title: 'Gols',
      value: stats.goals,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: `${calculateGoalsPerMatch()} por partida`
    },
    {
      title: 'Assistências',
      value: stats.assists,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Passes para gol'
    },
    {
      title: 'Partidas',
      value: stats.matches,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total jogadas'
    },
    {
      title: 'Vitórias',
      value: stats.wins,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: `${calculateWinRate()}% de aproveitamento`
    },
    {
      title: 'Presença',
      value: `${stats.attendance}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Taxa de comparecimento'
    },
    {
      title: 'Cartões',
      value: stats.yellowCards + stats.redCards,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `${stats.yellowCards} amarelos, ${stats.redCards} vermelhos`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Vitórias</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${calculateWinRate()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{calculateWinRate()}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Presença</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${stats.attendance}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.attendance}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gols por Partida</span>
              <span className="text-sm font-medium">{calculateGoalsPerMatch()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contribuições (Gols + Assistências)</span>
              <span className="text-sm font-medium">{stats.goals + stats.assists}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Vitória na última partida</p>
                <p className="text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">2 gols marcados</p>
                <p className="text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">1 assistência</p>
                <p className="text-xs text-gray-500">Há 1 semana</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSection;
