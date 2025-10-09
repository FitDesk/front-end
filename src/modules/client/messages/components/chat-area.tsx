import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, MoreVertical, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import type { Conversation, Message } from "../data";
import { webSocketService } from "@/core/services/web-socket.service";
import { useMessages } from "../hooks/use-messages";
import { useSendMessage } from "../hooks/use-send-message";

interface ChatAreaProps {
    conversation: Conversation;
    onBack?: () => void;
    isMobile?: boolean;
    onToggleFavorite?: (conversationId: string) => void;
}

export function ChatArea({ conversation, onBack, isMobile = false, onToggleFavorite }: ChatAreaProps) {
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], isLoading } = useMessages(conversation.id);
    const sendMessageMutation = useSendMessage();

    useEffect(() => {
        webSocketService.connect(conversation.id, () => {
        });

        return () => {
            webSocketService.disconnect();
        };
    }, [conversation.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        sendMessageMutation.mutate({
            conversationId: conversation.id,
            text: messageText.trim(),
            toUserId: conversation.user.id,
        });
        setMessageText("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-orange-500", "bg-pink-500", "bg-yellow-500", 
            "bg-green-500", "bg-blue-500", "bg-purple-500",
            "bg-red-500", "bg-indigo-500"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex flex-col bg-background h-full">
            {/* Header del chat */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground mr-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                
                <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                        <AvatarFallback className={`${getAvatarColor(conversation.user.name)} text-white font-medium`}>
                            {getInitials(conversation.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-medium text-foreground">{conversation.user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {conversation.isOnline ? "En línea" : "Desconectado"}
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onToggleFavorite?.(conversation.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            {conversation.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-background min-h-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-medium mb-2">Inicia la conversación</h3>
                        <p className="text-center text-muted-foreground/70">
                            Envía un mensaje para comenzar a chatear con {conversation.user.name}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages.map((message: Message, index: number) => {
                            const isCurrentUser = message.fromRole === "STUDENT";
                            const showAvatar = !isCurrentUser && (
                                index === 0 || 
                                messages[index - 1]?.fromRole !== message.fromRole
                            );
                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isCurrentUser={isCurrentUser}
                                    showAvatar={showAvatar}
                                    user={conversation.user}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input de mensaje */}
            <div className="p-4 border-t border-border bg-card flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 relative">
                        <textarea
                            placeholder="Escribe un mensaje..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-input border border-border text-foreground placeholder-muted-foreground focus:border-ring rounded-md px-3 py-2 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                            style={{ 
                                wordWrap: 'break-word', 
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.5'
                            }}
                            rows={1}
                        />
                    </div>

                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-2"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    showAvatar: boolean;
    user: { name: string; avatar: string };
}

function MessageBubble({ message, isCurrentUser, showAvatar, user }: MessageBubbleProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-orange-500", "bg-pink-500", "bg-yellow-500", 
            "bg-green-500", "bg-blue-500", "bg-purple-500",
            "bg-red-500", "bg-indigo-500"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isCurrentUser) {
        return (
            <div className="flex justify-end mb-4">
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-md">
                    <div className="flex flex-col items-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 break-words word-wrap overflow-wrap-anywhere">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-all">{message.text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                                {formatTime(message.createdAt)}
                            </span>
                            {/* Indicador de mensaje enviado */}
                            <div className="flex">
                                <div className="w-3 h-3 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-start mb-4">
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-md">
                    {/* Avatar solo si showAvatar es true */}
                    {showAvatar ? (
                        <Avatar className="h-8 w-8 mb-1">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className={`${getAvatarColor(user.name)} text-white font-medium text-xs`}>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="w-8"></div>
                    )}
                    
                    <div className="flex flex-col">
                        <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-2 break-words word-wrap overflow-wrap-anywhere">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-all">{message.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 ml-1">
                            {formatTime(message.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
