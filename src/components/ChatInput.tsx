import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isConnected: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isConnected }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      setIsSubmitting(true);
      
      // Имитируем отправку
      setTimeout(() => {
        onSendMessage(message);
        setMessage('');
        setIsSubmitting(false);
      }, 300);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        className="flex-grow transition-all duration-300 focus:scale-102"
        disabled={!isConnected || isSubmitting}
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={!message.trim() || !isConnected || isSubmitting}
        className="transition-all duration-300 hover:scale-105"
      >
        {isSubmitting ? (
          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Icon name="Send" className="mr-2 animate-pulse" />
        )}
        Отправить
      </Button>
    </form>
  );
};

export default ChatInput;