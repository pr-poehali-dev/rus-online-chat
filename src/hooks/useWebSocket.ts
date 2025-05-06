
import { useState, useEffect, useCallback, useRef } from 'react';

// Определяем типы для сообщений
export type MessageData = {
  id: string;
  text: string;
  sender: 'user' | 'other';
  username: string;
  timestamp: Date;
};

// Типы событий WebSocket
type WebSocketEvent = {
  type: 'message' | 'connection' | 'user' | 'error';
  data?: any;
};

// Хук для работы с WebSocket
export const useWebSocket = (url: string, username: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const socket = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Функция для установки соединения
  const connect = useCallback(() => {
    try {
      // В реальном приложении используйте URL вашего WebSocket сервера
      // Для локальной разработки можно использовать сервисы типа ws://localhost:8080
      const ws = new WebSocket(url);
      socket.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        // Отправляем информацию о пользователе при подключении
        ws.send(JSON.stringify({
          type: 'connection',
          data: { username }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const wsEvent: WebSocketEvent = JSON.parse(event.data);
          
          switch(wsEvent.type) {
            case 'message':
              // Преобразуем строковый timestamp в объект Date
              const messageData = {
                ...wsEvent.data,
                timestamp: new Date(wsEvent.data.timestamp)
              };
              setMessages(prev => [...prev, messageData]);
              break;
            case 'user':
              setUsers(wsEvent.data.users);
              break;
            case 'connection':
              // Обновляем список пользователей при новом подключении
              setUsers(wsEvent.data.users);
              break;
            case 'error':
              setError(wsEvent.data.message);
              break;
          }
        } catch (e) {
          console.error('Ошибка обработки сообщения от сервера:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Пробуем переподключиться через 5 секунд
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      ws.onerror = () => {
        setError('Ошибка подключения к серверу');
        ws.close();
      };

    } catch (e) {
      setError('Не удалось установить соединение');
      setIsConnected(false);
    }
  }, [url, username]);

  // Функция для отправки сообщения
  const sendMessage = useCallback((text: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const messageData: Omit<MessageData, 'id' | 'timestamp'> & {timestamp: string} = {
        text,
        sender: 'user',
        username,
        timestamp: new Date().toISOString()
      };
      
      socket.current.send(JSON.stringify({
        type: 'message',
        data: messageData
      }));
    }
  }, [username]);

  // Подключаемся при монтировании компонента
  useEffect(() => {
    connect();
    
    // Очищаем при размонтировании
    return () => {
      if (socket.current) {
        socket.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    users,
    error,
    sendMessage
  };
};
