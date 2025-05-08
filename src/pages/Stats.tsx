
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import ImportStats from '@/components/ImportStats';

const Stats = () => {
  const { users, matches } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sort users by goals scored
  const topGoalScorers = [...users].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, 5);
  
  // Sort users by assists (new)
  const topAssists = [...users].sort((a, b) => (b.stats.assists || 0) - (a.stats.assists || 0)).slice(0, 5);
  
  // Sort users by attendance
  const topAttendance = [...users].sort((a, b) => b.stats.attendance - a.stats.attendance).slice(0, 5);

  // Format data for charts
  const goalData = topGoalScorers.map(user => ({
    name: user.name.split(' ')[0], // Just first name for display
    goals: user.stats.goals
  }));

  const assistsData = topAssists.map(user => ({
    name: user.name.split(' ')[0],
    assists: user.stats.assists || 0
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
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="players">Jogadores</TabsTrigger>
            <TabsTrigger value="import">Importar Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
                  <CardTitle className="text-lg">Top Assistências</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4">
                    {topAssists.map((user, index) => (
                      <li key={user.id} className="flex items-center">
                        <div className="w-6 text-center font-bold text-gray-500">{index + 1}</div>
                        <Avatar className="h-10 w-10 mx-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">{user.name}</div>
                        <div className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                          {user.stats.assists || 0} assist.
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Jogador</th>
                        <th className="text-center p-2">Pos</th>
                        <th className="text-center p-2">Jogos</th>
                        <th className="text-center p-2">Gols</th>
                        <th className="text-center p-2">Assist</th>
                        <th className="text-center p-2">Vit</th>
                        <th className="text-center p-2">CA</th>
                        <th className="text-center p-2">CV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </td>
                          <td className="text-center p-2">{user.position.substring(0, 3)}</td>
                          <td className="text-center p-2">{user.stats.matches}</td>
                          <td className="text-center p-2">{user.stats.goals}</td>
                          <td className="text-center p-2">{user.stats.assists || 0}</td>
                          <td className="text-center p-2">{user.stats.wins}</td>
                          <td className="text-center p-2">{user.stats.yellowCards || 0}</td>
                          <td className="text-center p-2">{user.stats.redCards || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="import">
            <ImportStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Stats;
