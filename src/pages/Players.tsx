
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/Header';
import PlayerCard from '@/components/PlayerCard';
import { Input } from '@/components/ui/input';

const Players = () => {
  const { users } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Jogadores</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar jogadores por nome ou posição..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <PlayerCard key={user.id} player={user} showStats={true} />
          ))}
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum jogador encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Players;
