
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Chat = () => {
  const { chatMessages, sendMessage } = useAppContext();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col container mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Chat da Galera</h1>
        
        <div className="flex-1 overflow-y-auto bg-white rounded-t-lg shadow-sm p-4 mb-0">
          {chatMessages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
          
          {chatMessages.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>Nenhuma mensagem ainda. Seja o primeiro a enviar!</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-b-lg shadow-sm p-2 flex items-center">
          <Input
            type="text"
            placeholder="Escreva uma mensagem..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            type="button" 
            onClick={handleSendMessage} 
            className="ml-2"
            size="icon"
          >
            <Send size={20} />
          </Button>
        </div>
      </main>
      
      <div className="h-6"></div>
    </div>
  );
};

export default Chat;
