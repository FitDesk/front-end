import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService } from '../services/chatService';
import { useChatStore } from '../store/chatStore';
import type { Message as MessageType } from '../types/chat.types';

const TypingIndicator = () => (
  <div className="flex space-x-1.5 items-center">
    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
  </div>
);

const ChatModal: React.FC = () => {
  const { isOpen, closeChat } = useChatStore();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
   
    typingSoundRef.current = new Audio('/sounds/teclado.mp3');
    typingSoundRef.current.loop = true;
    
    return () => {
      if (typingSoundRef.current) {
        typingSoundRef.current.pause();
        typingSoundRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    
    if (isTyping && typingSoundRef.current) {
      typingSoundRef.current.play().catch(e => console.error("Error al reproducir sonido de teclado:", e));
    } else if (typingSoundRef.current) {
      typingSoundRef.current.pause();
      typingSoundRef.current.currentTime = 0;
    }
  }, [isTyping]);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'bot' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error al reproducir sonido:", e));
    }
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/notifi.mp3');
   
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        addMessage('¡Hola! Soy tu asistente de FitDesk. ¿En qué puedo ayudarte hoy?', 'bot');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = inputValue.trim();
    if (!messageText || isLoading || isTyping) return;

    try {
      setIsLoading(true);
      
      
      addMessage(messageText, 'user');
      setInputValue('');
      
    
      setIsTyping(true);

      
      const response = await chatService.sendMessage({
        message: messageText,
        // agregar datos necesarios para el backend
        //  userId, sessionId, etc.
      });

      
      const responseTime = Math.max(1500, Math.min(response.response.length * 30, 4000)); 
      setTimeout(() => {
        addMessage(response.response || 'No se pudo obtener una respuesta del asistente.', 'bot');
        setIsTyping(false);
      }, responseTime);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      addMessage('Lo siento, ha ocurrido un error al procesar tu mensaje.', 'bot');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col w-full max-w-md h-[600px] pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-500 p-3 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logowhiteIA.svg" 
                  alt="FitDesk AI" 
                  className="w-10 h-10"
                />
                <p className="text-white text-sm opacity-90">
                  {isTyping ? 'Escribiendo...' : 'En línea'}
                </p>
              </div>
              <button 
                onClick={closeChat}
                className="text-white hover:bg-red-600 p-1 rounded-full focus:outline-none"
                aria-label="Cerrar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-red-500 text-white rounded-tr-none'
                          : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-md rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm dark:text-gray-100">{message.text}</p>
                      <p className={`text-xs opacity-70 mt-1 text-right ${
                        message.sender === 'user' ? 'text-red-100' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-600 shadow-md rounded-2xl rounded-tl-none px-4 py-3">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isLoading ? 'Enviando mensaje...' : 'Enviar mensaje'}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
