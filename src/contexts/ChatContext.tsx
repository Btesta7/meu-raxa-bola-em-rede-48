
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { mockChatMessages } from '../data/mockData';
import { useUserContext } from './UserContext';

interface ChatContextType {
  chatMessages: ChatMessage[];
  sendMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const { user } = useUserContext();

  const sendMessage = (message: string) => {
    if (!user || !message.trim()) return;

    const newMessage: ChatMessage = {
      id: `${chatMessages.length + 1}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, newMessage]);
  };

  const value = {
    chatMessages,
    sendMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
