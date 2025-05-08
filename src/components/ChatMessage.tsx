
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatMessage as ChatMessageType } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/contexts/AppContext';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { currentUser } = useAppContext();
  const isCurrentUser = currentUser?.id === message.userId;
  
  const formattedTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'HH:mm', { locale: ptBR });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.userAvatar} alt={message.userName} />
          <AvatarFallback>{message.userName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className={`mx-2 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
          <div className={`
            py-2 px-3 rounded-lg
            ${isCurrentUser 
              ? 'bg-primary text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }
          `}>
            {!isCurrentUser && (
              <p className="text-xs font-medium mb-1 text-gray-600">{message.userName}</p>
            )}
            <p className="text-sm">{message.message}</p>
          </div>
          <p className={`text-xs mt-1 text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {formattedTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
