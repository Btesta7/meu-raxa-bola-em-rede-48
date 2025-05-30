
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BarChart3, MessageCircle, LogOut } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => navigate('/')} role="button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="size-7"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a9.96 9.96 0 0 0-6.33 2.258c-.22.189.05.523.287.506 2.1-.148 5.445.648 7.223 2.426 1.77 1.77 2.568 5.098 2.426 7.202-.017.236.317.507.506.287A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              <path d="M12 22a9.96 9.96 0 0 0 6.33-2.258c.22-.189-.05-.523-.287-.506-2.1.148-5.445-.648-7.223-2.426-1.77-1.77-2.568-5.098-2.426-7.202.017-.236-.317-.507-.506-.287A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10Z" />
            </svg>
            <h1 className="text-xl font-bold">Meu Raxa</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.isAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-white hover:bg-white/10"
              >
                <LogOut size={16} />
              </Button>
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
