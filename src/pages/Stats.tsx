
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Stats = () => {
  const { users, matches } = useAppContext();
  
  // Sort users by goals scored
  const topGoalScorers = [...users].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, 5);
  
  // Sort users by attendance
  const topAttendance = [...users].sort((a, b) => b.stats.attendance - a.stats.attendance).slice(0, 5);

  // Format data for charts
  const goalData = topGoalScorers.map(user => ({
    name: user.name.split(' ')[0], // Just first name for display
    goals: user.stats.goals
  }));

  // Calculate position distribution
  const positionCount = users.reduce((acc, user) => {
    acc[user.position] = (acc[user.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const positionData = Object.entries(positionCount).map(([name, value]) => ({
    name,
    value,
  }));

  const POSITION_COLORS = ['#FFCC00', '#3B82F6', '#10B981', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Estatísticas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Artilheiros</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={goalData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="goals" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribuição de Posições</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={positionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {positionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={POSITION_COLORS[index % POSITION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Artilheiros</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-4">
                {topGoalScorers.map((user, index) => (
                  <li key={user.id} className="flex items-center">
                    <div className="w-6 text-center font-bold text-gray-500">{index + 1}</div>
                    <Avatar className="h-10 w-10 mx-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">{user.name}</div>
                    <div className="bg-emerald-100 text-emerald-700 font-medium px-3 py-1 rounded-full">
                      {user.stats.goals} gols
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maior Frequência</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-4">
                {topAttendance.map((user, index) => (
                  <li key={user.id} className="flex items-center">
                    <div className="w-6 text-center font-bold text-gray-500">{index + 1}</div>
                    <Avatar className="h-10 w-10 mx-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">{user.name}</div>
                    <div className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                      {user.stats.attendance}%
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Stats;
