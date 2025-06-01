
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminContext } from '@/contexts/AdminContext';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Calendar, MapPin, Users, Edit, Trash2, Play, Plus } from 'lucide-react';

const AdminMatchManagement = () => {
  const { scheduledMatches, deleteMatch } = useAdminContext();
  const { users } = useUserContext();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlayerName = (playerId: string) => {
    const player = users.find(u => u.id === playerId);
    return player ? player.name : 'Jogador não encontrado';
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta partida?')) {
      await deleteMatch(matchId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⚽ Gerenciar Partidas</h1>
            <p className="text-gray-600">Administre todas as partidas agendadas</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/criar-partida')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Nova Partida
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Partidas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledMatches.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas Ativas</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {scheduledMatches.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas Completadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {scheduledMatches.filter(m => m.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Confirmações</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {scheduledMatches.reduce((acc, match) => acc + match.confirmedPlayers.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Partidas */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Partidas</CardTitle>
            <CardDescription>Gerencie e acompanhe suas partidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledMatches.length === 0 ? (
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
                scheduledMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{match.title}</h3>
                          <Badge className={getStatusColor(match.status)}>
                            {match.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(match.date).toLocaleDateString('pt-BR')} às {match.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{match.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{match.confirmedPlayers.length}/{match.maxPlayers} confirmados</span>
                          </div>
                        </div>
                        {match.description && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-3 rounded">
                            {match.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/editar-partida/${match.id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMatch(match.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                        {match.confirmedPlayers.length >= 10 && (
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/live-match/${match.id}`)}
                          >
                            <Play size={16} className="mr-1" />
                            Ao Vivo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Detalhes dos Jogadores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Jogadores Confirmados ({match.confirmedPlayers.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {match.confirmedPlayers.slice(0, 8).map((playerId) => (
                            <span key={playerId} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {getPlayerName(playerId)}
                            </span>
                          ))}
                          {match.confirmedPlayers.length > 8 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{match.confirmedPlayers.length - 8} mais
                            </span>
                          )}
                        </div>
                      </div>
                      {match.waitingList.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">
                            Lista de Espera ({match.waitingList.length})
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {match.waitingList.slice(0, 4).map((playerId) => (
                              <span key={playerId} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {getPlayerName(playerId)}
                              </span>
                            ))}
                            {match.waitingList.length > 4 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{match.waitingList.length - 4} mais
                              </span>
                            )}
                          </div>
                        </div>
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

export default AdminMatchManagement;
