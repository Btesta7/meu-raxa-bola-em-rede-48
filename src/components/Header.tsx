
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ball, Calendar, Users, BarChart3, MessageCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => navigate('/')} role="button">
            <Ball size={28} />
            <h1 className="text-xl font-bold">Meu Raxa</h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
      
      <nav className="bg-primary/90 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between py-2">
            <button 
              onClick={() => navigate('/')} 
              className="flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <Calendar size={20} />
              <span>Partidas</span>
            </button>
            
            <button 
              onClick={() => navigate('/players')} 
              className="flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <Users size={20} />
              <span>Jogadores</span>
            </button>
            
            <button 
              onClick={() => navigate('/stats')} 
              className="flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <BarChart3 size={20} />
              <span>Estatísticas</span>
            </button>
            
            <button 
              onClick={() => navigate('/chat')} 
              className="flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
