
import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Как у тебя дела?',
      sender: 'other',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (text: string) => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Имитация ответа другого пользователя через 1 секунду
    setTimeout(() => {
      const otherMessage: Message = {
        id: Date.now() + 1,
        text: 'Это автоматический ответ на ваше сообщение.',
        sender: 'other',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, otherMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary/10 p-3 text-center border-b">
        <h2 className="font-semibold">Онлайн чат</h2>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
