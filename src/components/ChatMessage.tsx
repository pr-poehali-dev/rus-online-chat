import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type ChatMessageProps = {
  message: string;
  sender: 'user' | 'other';
  timestamp: Date;
  username?: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  sender, 
  timestamp,
  username = sender === 'user' ? 'Вы' : 'Собеседник' 
}) => {
  return (
    <div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {sender !== 'user' && (
        <Avatar className="h-8 w-8 mr-2 transition-all duration-300 hover:scale-110">
          <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div 
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          sender === 'user' 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
        } transition-all duration-300 hover:shadow-md`}
      >
        {sender !== 'user' && (
          <div className="font-semibold text-xs mb-1">{username}</div>
        )}
        <p className="text-sm">{message}</p>
        <div className={`text-xs mt-1 ${sender === 'user' ? 'text-primary-foreground/80' : 'text-secondary-foreground/80'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {sender === 'user' && (
        <Avatar className="h-8 w-8 ml-2 transition-all duration-300 hover:scale-110">
          <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=user`} />
          <AvatarFallback>В</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;