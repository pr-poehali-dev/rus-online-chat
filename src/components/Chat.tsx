
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

  // Используем наш хук, только если пользователь ввёл имя
  const {
    isConnected,
    messages,
    users,
    error,
    sendMessage
  } = !username ? {
    isConnected: false,
    messages: [],
    users: [],
    error: null,
    sendMessage: () => {}
  } : useWebSocket(wsUrl, username);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleStartChat = () => {
    if (username.trim()) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Диалог для ввода имени пользователя */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Представьтесь, пожалуйста</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Ваше имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="URL WebSocket сервера"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                По умолчанию используется эхо-сервер для демонстрации
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartChat} disabled={!username.trim()}>
              Начать общение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Заголовок чата */}
      <div className="bg-primary/10 p-3 flex justify-between items-center border-b">
        <h2 className="font-semibold">Онлайн чат</h2>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? (
            <>
              <Icon name="Wifi" className="h-3 w-3 mr-1" />
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
        <Alert variant="destructive" className="m-2">
          <Icon name="AlertTriangle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Сообщения чата */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Icon name="MessageSquare" className="h-12 w-12 mb-2" />
            <p>Сообщений пока нет</p>
            <p className="text-xs">Начните общение прямо сейчас</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
            username={message.username}
          />
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
