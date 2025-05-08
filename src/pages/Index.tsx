
import React, { useState } from 'react';
import { SoccerBall, Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import CreateMatchModal from '@/components/CreateMatchModal';

const Index = () => {
  const { matches } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Partidas</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-1">
            <Plus size={18} />
            <span>Nova Partida</span>
          </Button>
        </div>
        
        {upcomingMatches.length === 0 && pastMatches.length === 0 ? (
          <div className="text-center py-20">
            <SoccerBall className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-600">Nenhuma partida agendada</h3>
            <p className="mt-2 text-gray-500">Crie sua primeira partida clicando no botão acima.</p>
          </div>
        ) : (
          <>
            {upcomingMatches.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-3">Próximas partidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}
            
            {pastMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-3">Partidas anteriores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <CreateMatchModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Index;
