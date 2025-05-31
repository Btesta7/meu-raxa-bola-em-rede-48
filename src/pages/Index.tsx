import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import CreateMatchModal from '@/components/CreateMatchModal';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import DashboardGrid from '@/components/dashboard/DashboardGrid';

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

  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    // Redirecionar para a nova página de partidas agendadas
    if (user) {
      navigate('/partidas');
    }
  }, [user, navigate]);

  // Mostra o dashboard tradicional enquanto redireciona
  return <DashboardGrid />;
};

export default Index;
