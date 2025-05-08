
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto h-16 w-16 text-gray-300"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a9.96 9.96 0 0 0-6.33 2.258c-.22.189.05.523.287.506 2.1-.148 5.445.648 7.223 2.426 1.77 1.77 2.568 5.098 2.426 7.202-.017.236.317.507.506.287A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              <path d="M12 22a9.96 9.96 0 0 0 6.33-2.258c.22-.189-.05-.523-.287-.506-2.1.148-5.445-.648-7.223-2.426-1.77-1.77-2.568-5.098-2.426-7.202.017-.236-.317-.507-.506-.287A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10Z" />
            </svg>
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
