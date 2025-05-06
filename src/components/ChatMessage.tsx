
import React from 'react';

type ChatMessageProps = {
  message: string;
  sender: 'user' | 'other';
  timestamp: Date;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  return (
    <div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div 
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          sender === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        <p className="text-sm">{message}</p>
        <div className={`text-xs mt-1 ${sender === 'user' ? 'text-primary-foreground/80' : 'text-secondary-foreground/80'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
