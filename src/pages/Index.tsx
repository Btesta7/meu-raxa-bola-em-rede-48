
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import CreateMatchModal from '@/components/CreateMatchModal';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { matches } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  // Sort matches: scheduled first (by date), then completed, then canceled
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
    
    if (a.status === 'completed' && b.status === 'canceled') return -1;
    if (a.status === 'canceled' && b.status === 'completed') return 1;
    
    // If same status, sort by date (newer first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const upcomingMatches = sortedMatches.filter(match => match.status === 'scheduled');
  const pastMatches = sortedMatches.filter(match => match.status !== 'scheduled');

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
            onClick={() => navigate('/live-match')}
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
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Matches Preview */}
        {pastMatches.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Partidas Recentes</h2>
              <Button variant="outline" onClick={() => navigate('/stats')}>
                Ver Estatísticas
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastMatches.slice(0, 3).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        <CreateMatchModal 
          open={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </main>
    </div>
  );
};

export default Index;
