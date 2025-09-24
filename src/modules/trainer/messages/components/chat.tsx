import { useEffect, useState } from "react";
import { ChatList } from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import type { Message, User } from "../data";
import { webSocketService } from "@/core/services/web-socket.service";

interface ChatProps {
  roomId: string;
  loggedInUser: User;
}

export function Chat({ roomId, loggedInUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    webSocketService.connect(roomId, (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        const formattedMessage = {
          ...message,
          createdAt: new Date(Number(message.createdAt) * 1000).toISOString(),
        };
        return [...prev, formattedMessage];
      });
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [roomId]);

const handleSendMessage = (text: string) => {
    console.log("enviar mensaje ", text);
    if (!webSocketService.socket) {
        console.error("El WebSocket no está inicializado.");
        return;
    }
    if (webSocketService.socket?.readyState !== WebSocket.OPEN) {
        console.log("Estado de WebSocket", webSocketService.socket?.readyState);
        console.error("No se puede enviar el mensaje. WebSocket no está conectado.");
        return;
    }

    // Ajustar el formato del mensaje para que coincida con lo que espera el backend
    const message = {
        // roomId,
        fromId: loggedInUser.id,
        fromRole: loggedInUser.id.startsWith("trainer") ? "TRAINER" : "STUDENT",
        text,
    };
    console.log("El mensaje a enviar es ", message);
    webSocketService.sendMessage(message);
};

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-hidden">
        <ChatList messages={messages} selectedUser={loggedInUser} />
      </div>
      <ChatBottombar onSendMessage={handleSendMessage} />
    </div>
  );
}