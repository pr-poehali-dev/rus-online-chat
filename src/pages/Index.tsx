
import React from 'react';
import Chat from '@/components/Chat';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Онлайн чат</h1>
      </header>
      
      <main className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md h-[600px] border rounded-lg shadow-lg overflow-hidden bg-card">
          <Chat />
        </div>
      </main>
      
      <footer className="bg-muted p-3 text-center text-muted-foreground text-sm">
        <p>© 2025 Онлайн чат. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Index;
