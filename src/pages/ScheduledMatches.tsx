import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminContext } from '@/contexts/AdminContext';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ScheduledMatchCard from '@/components/ScheduledMatchCard';
import Header from '@/components/Header';
import { Calendar, Plus, Settings, Play, Radio } from 'lucide-react';

const ScheduledMatches = () => {
  const { scheduledMatches, isAdmin } = useAdminContext();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [selectedMatchForLive, setSelectedMatchForLive] = useState<string>('');

  const activeMatches = scheduledMatches.filter(m => m.status === 'active');
  const upcomingMatches = activeMatches.filter(m => new Date(m.date) >= new Date());
  
  // Partidas elegíveis para modo ao vivo (com pelo menos 15 jogadores confirmados)
  const liveEligibleMatches = upcomingMatches.filter(m => m.confirmedPlayers.length >= 15);

  const handleStartLiveMatch = () => {
    if (selectedMatchForLive) {
      navigate(`/live-match/${selectedMatchForLive}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📅 Próximas Partidas</h1>
            <p className="text-gray-600">
              {isAdmin 
                ? 'Gerencie e acompanhe suas partidas agendadas' 
                : 'Confirme sua presença nas partidas agendadas'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {/* Botão Partidas ao Vivo - visível para todos */}
            <Button 
              variant="outline"
              onClick={() => navigate('/live-match')}
              className="flex items-center gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <Radio size={16} />
              Partidas ao Vivo
            </Button>
            
            {isAdmin && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/gerenciar-partidas')}
                  className="flex items-center gap-2"
                >
                  <Settings size={16} />
                  Gerenciar
                </Button>
                <Button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Painel Admin
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Controle de Partidas ao Vivo - Apenas para Admin */}
        {isAdmin && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="text-green-600" size={20} />
                Iniciar Partida ao Vivo
              </CardTitle>
              <CardDescription>
                Selecione uma partida agendada com pelo menos 15 jogadores confirmados para iniciar o modo ao vivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {liveEligibleMatches.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">
                    Nenhuma partida elegível para modo ao vivo
                  </p>
                  <p className="text-sm text-gray-500">
                    É necessário ter pelo menos 15 jogadores confirmados
                  </p>
                </div>
              ) : (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escolher Partida
                    </label>
                    <Select value={selectedMatchForLive} onValueChange={setSelectedMatchForLive}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma partida agendada..." />
                      </SelectTrigger>
                      <SelectContent>
                        {liveEligibleMatches.map((match) => (
                          <SelectItem key={match.id} value={match.id}>
                            {match.title} - {new Date(match.date).toLocaleDateString('pt-BR')} às {match.time} 
                            ({match.confirmedPlayers.length} jogadores)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleStartLiveMatch}
                    disabled={!selectedMatchForLive}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play size={16} className="mr-2" />
                    Iniciar Partida ao Vivo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estatísticas Rápidas para o Jogador */}
        {!isAdmin && user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seu Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {scheduledMatches.filter(m => m.confirmedPlayers.includes(user.id)).length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {scheduledMatches.filter(m => m.waitingList.includes(user.id)).length}
                  </div>
                  <div className="text-sm text-gray-600">Lista de Espera</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {upcomingMatches.length}
                  </div>
                  <div className="text-sm text-gray-600">Disponíveis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas para Admin */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {upcomingMatches.length}
                  </div>
                  <div className="text-sm text-gray-600">Partidas Ativas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {scheduledMatches.reduce((acc, match) => acc + match.confirmedPlayers.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Confirmações</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {scheduledMatches.reduce((acc, match) => acc + match.waitingList.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Lista de Espera</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {scheduledMatches.filter(m => m.confirmedPlayers.length >= 10).length}
                  </div>
                  <div className="text-sm text-gray-600">Prontas para Iniciar</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Partidas */}
        <div className="space-y-4">
          {upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma partida agendada</h3>
                <p className="text-gray-600 mb-4">
                  {isAdmin 
                    ? 'Você pode criar uma nova partida no painel administrativo.'
                    : 'Aguarde os administradores agendarem novas partidas.'
                  }
                </p>
                {isAdmin && (
                  <Button onClick={() => navigate('/admin/criar-partida')}>
                    Criar Primeira Partida
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMatches.map((match) => (
                <ScheduledMatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* Informações para Jogadores */}
        {!isAdmin && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">ℹ️ Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <ul className="space-y-2 text-sm">
                <li>• As partidas são agendadas pelos administradores</li>
                <li>• Confirme sua presença clicando no botão "Confirmar Presença"</li>
                <li>• Se a partida estiver lotada, você entrará na lista de espera</li>
                <li>• Partidas ao vivo começam quando há pelo menos 10 jogadores confirmados</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ScheduledMatches;
