
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        className="flex-grow"
        disabled={!isConnected}
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={!message.trim() || !isConnected}
      >
        <Icon name="Send" className="mr-2" />
        Отправить
      </Button>
    </form>
  );
};

export default ChatInput;
