
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Login = () => {
  const { users, login } = useAppContext();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleLogin = () => {
    if (selectedUser) {
      login(selectedUser);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="size-8 text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a9.96 9.96 0 0 0-6.33 2.258c-.22.189.05.523.287.506 2.1-.148 5.445.648 7.223 2.426 1.77 1.77 2.568 5.098 2.426 7.202-.017.236.317.507.506.287A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
              <path d="M12 22a9.96 9.96 0 0 0 6.33-2.258c.22-.189-.05-.523-.287-.506-2.1.148-5.445-.648-7.223-2.426-1.77-1.77-2.568-5.098-2.426-7.202.017-.236-.317-.507-.506-.287A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10Z" />
            </svg>
            <h1 className="text-2xl font-bold text-primary">Meu Raxa</h1>
          </div>
          <CardTitle>Selecione seu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {users.map(user => (
              <div
                key={user.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedUser === user.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.position}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {user.stats.goals} gols
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {user.stats.matches} jogos
                      </Badge>
                      {user.id === 'user-1' && (
                        <Badge variant="default" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={!selectedUser}
            className="w-full"
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
