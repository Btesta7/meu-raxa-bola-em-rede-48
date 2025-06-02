
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ScheduledMatchCard from '@/components/ScheduledMatchCard';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '@/contexts/AdminContext';
import { useUserContext } from '@/contexts/UserContext';

const Index = () => {
  const { scheduledMatches } = useAdminContext();
  const { user } = useUserContext();
  const navigate = useNavigate();

  // Filtrar apenas partidas ativas e futuras
  const activeMatches = scheduledMatches.filter(m => m.status === 'active');
  const upcomingMatches = activeMatches.filter(m => new Date(m.date) >= new Date());
  const pastMatches = scheduledMatches.filter(m => m.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">⚽ Nosso Racha</h1>
            <p className="text-lg text-gray-600">Organize e participe das melhores partidas</p>
          </div>
          <Button onClick={() => navigate('/partidas')} size="lg">
            Ver Todas as Partidas
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => navigate('/partidas')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold text-gray-800">Partidas Agendadas</h3>
              <p className="text-sm text-gray-600 mt-1">
                {upcomingMatches.length} partida{upcomingMatches.length !== 1 ? 's' : ''} próxima{upcomingMatches.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/partidas')}
            className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-white"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🔴</div>
              <h3 className="font-semibold">Partidas ao Vivo</h3>
              <p className="text-sm text-red-100 mt-1">
                Acompanhe em tempo real
              </p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/players')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-800">Jogadores</h3>
              <p className="text-sm text-gray-600 mt-1">
                Veja estatísticas e rankings
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas do Usuário */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Seu Status</h2>
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
          </div>
        )}

        {/* Upcoming Matches Preview */}
        {upcomingMatches.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Próximas Partidas</h2>
              <Button variant="outline" onClick={() => navigate('/partidas')}>
                Ver Todas
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.slice(0, 3).map((match) => (
                <ScheduledMatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Matches Preview */}
        {pastMatches.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Partidas Recentes</h2>
              <Button variant="outline" onClick={() => navigate('/stats')}>
                Ver Estatísticas
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastMatches.slice(0, 3).map((match) => (
                <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{match.title}</h3>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Finalizada
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 {new Date(match.date).toLocaleDateString('pt-BR')}</p>
                    <p>📍 {match.location}</p>
                    <p>👥 {match.confirmedPlayers.length} jogadores</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {upcomingMatches.length === 0 && pastMatches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma partida agendada</h3>
            <p className="text-gray-600 mb-6">
              Aguarde os administradores criarem novas partidas ou entre em contato com eles.
            </p>
            <Button onClick={() => navigate('/partidas')}>
              Ver Partidas
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
