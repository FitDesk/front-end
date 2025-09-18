import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/chatStore';

const ChatButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { isOpen, toggleChat } = useChatStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error al reproducir sonido:", e));
    }
  };

  useEffect(() => {
    
    audioRef.current = new Audio('/sounds/notifi.mp3');
    
    
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">¿En qué puedo ayudarte hoy?</p>
            </div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-200 dark:border-gray-700"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          toggleChat();
          setShowTooltip(false);
          if (!isOpen) {
            playNotificationSound();
          }
        }}
        className="bg-red-500 w-16 h-16 rounded-full shadow-lg flex items-center justify-center focus:outline-none relative"
        aria-label="Abrir chat"
      >
        <img 
          src="/logowhite.svg" 
          alt="Chat" 
          className="w-8 h-8"
        />
      </motion.button>
    </div>
  );
};

export default ChatButton;
