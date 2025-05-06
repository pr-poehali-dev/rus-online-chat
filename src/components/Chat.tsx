import React, { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Badge } from './ui/badge';
import Icon from './ui/icon';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from './ui/dialog';

// Временный URL для демонстрации. В реальном приложении используйте URL вашего WebSocket сервера
const WEBSOCKET_URL = 'wss://echo.websocket.org'; // Это эхо-сервер для демо

const Chat: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [wsUrl, setWsUrl] = useState(WEBSOCKET_URL);
  const [isLoading, setIsLoading] = useState(false);

  // Дополнительное состояние для работы с WebSocket
  const wsConnect = useWebSocket(wsUrl, username || 'Гость');
  const { isConnected, messages, users, error, sendMessage } = wsConnect;

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleStartChat = () => {
    if (username.trim()) {
      setIsLoading(true);
      // Имитируем загрузку
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      
      // Диалог для ввода имени пользователя
  <Dialog open={isDialogOpen} onOpenChange={(open) => {
    // Предотвращаем закрытие диалога при клике вне, если имя не введено
    if (!open && !username.trim()) return;
    setIsDialogOpen(open);
  }}>
    <DialogContent className="animate-in fade-in-0 zoom-in-95 data-[state=open]:duration-500">
      <DialogHeader>
        <DialogTitle>Представьтесь, пожалуйста</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Input
            placeholder="Ваше имя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="transition-all duration-300 focus:scale-105"
          />
        </div>
        <div className="space-y-2">
          <Input
            placeholder="URL WebSocket сервера"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="transition-all duration-300 focus:scale-105"
          />
          <p className="text-xs text-muted-foreground">
            По умолчанию используется эхо-сервер для демонстрации
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button 
          onClick={handleStartChat} 
          disabled={!username.trim() || isLoading}
          className="relative overflow-hidden transition-all duration-300 hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Подключение...
            </div>
          ) : (
            "Начать общение"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

      {/* Заголовок чата */}
      <div className="bg-primary/10 p-3 flex justify-between items-center border-b transition-all duration-300 hover:bg-primary/20">
        <h2 className="font-semibold">Онлайн чат</h2>
        <Badge 
          variant={isConnected ? "default" : "destructive"}
          className="transition-all duration-300 hover:scale-110"
        >
          {isConnected ? (
            <>
              <Icon name="Wifi" className="h-3 w-3 mr-1 animate-pulse" />
              Подключено
            </>
          ) : (
            <>
              <Icon name="WifiOff" className="h-3 w-3 mr-1" />
              Отключено
            </>
          )}
        </Badge>
      </div>
      
      {/* Отображение ошибки, если есть */}
      {error && (
        <Alert 
          variant="destructive" 
          className="m-2 animate-in slide-in-from-top-5 duration-300"
        >
          <Icon name="AlertTriangle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Сообщения чата */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in-0 duration-700">
            <Icon name="MessageSquare" className="h-12 w-12 mb-2 animate-bounce" />
            <p>Сообщений пока нет</p>
            <p className="text-xs">Начните общение прямо сейчас</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={message.id || index}
            className={`animate-in ${message.sender === 'user' ? 'slide-in-from-right-10' : 'slide-in-from-left-10'} duration-300`}
          >
            <ChatMessage
              message={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
              username={message.username}
            />
          </div>
        ))}
      </div>
      
      {/* Ввод сообщения */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isConnected={isConnected}
      />
    </div>
  );
};

export default Chat;