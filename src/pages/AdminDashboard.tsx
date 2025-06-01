
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminContext } from '@/contexts/AdminContext';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, Settings, UserCheck, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';

const AdminDashboard = () => {
  const { scheduledMatches } = useAdminContext();
  const { users } = useUserContext();
  const navigate = useNavigate();

  const activeMatches = scheduledMatches.filter(m => m.status === 'active');
  const totalConfirmed = scheduledMatches.reduce((acc, match) => acc + match.confirmedPlayers.length, 0);
  const activePlayers = new Set(scheduledMatches.flatMap(m => m.confirmedPlayers)).size;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔧 Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie partidas e jogadores</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/criar-partida')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Criar Nova Partida
          </Button>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/gerenciar-partidas')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Calendar size={32} className="mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Gerenciar Partidas</h3>
                <p className="text-sm text-gray-600">Ver todas as partidas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/gerenciar-jogadores')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Users size={32} className="mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Gerenciar Jogadores</h3>
                <p className="text-sm text-gray-600">Administrar usuários</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/criar-partida')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Plus size={32} className="mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Nova Partida</h3>
                <p className="text-sm text-gray-600">Criar partida</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/stats')}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold">Estatísticas</h3>
                <p className="text-sm text-gray-600">Ver dados gerais</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas Ativas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMatches.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jogadores Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlayers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Confirmações</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConfirmed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jogadores</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Partidas Recentes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>📋 Partidas Recentes</CardTitle>
                <CardDescription>Últimas partidas criadas</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/gerenciar-partidas')}
              >
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledMatches.slice(0, 3).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhuma partida agendada</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/admin/criar-partida')}
                  >
                    Criar primeira partida
                  </Button>
                </div>
              ) : (
                scheduledMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{match.title}</h3>
                        <Badge className={getStatusColor(match.status)}>
                          {match.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {new Date(match.date).toLocaleDateString('pt-BR')} às {match.time}</p>
                        <p>📍 {match.location}</p>
                        <p>👥 {match.confirmedPlayers.length}/{match.maxPlayers} confirmados</p>
                        {match.waitingList.length > 0 && (
                          <p>⏳ {match.waitingList.length} na lista de espera</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/editar-partida/${match.id}`)}
                      >
                        Editar
                      </Button>
                      {match.confirmedPlayers.length >= 10 && (
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/live-match/${match.id}`)}
                        >
                          Iniciar Ao Vivo
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
