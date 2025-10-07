import { Search, MoreHorizontal, Bell } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import type { Conversation } from "../data";

interface ConversationsListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    isLoading: boolean;
    selectedConversationId?: string;
    isMobile?: boolean;
}

export function ConversationsList({
    conversations,
    onSelectConversation,
    searchTerm,
    onSearchChange,
    isLoading,
    selectedConversationId,
    isMobile = false,
}: ConversationsListProps) {
   
    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold text-foreground">Mensajes</h1>
                        {!isMobile && (
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {isMobile && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <Bell className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Contador de conversaciones */}
                <p className="text-sm text-muted-foreground mb-4">
                    {conversations.length} conversaciones activas
                </p>

                {/* Barra de búsqueda */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar conversaciones..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 mb-2">
                                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                                <div className="flex-1">
                                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-medium mb-2">No hay conversaciones</h3>
                        <p className="text-center text-muted-foreground/70">
                            Cuando tengas conversaciones con estudiantes, aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="p-2">
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={conversation.id === selectedConversationId}
                                onClick={() => onSelectConversation(conversation)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer para móvil */}
            {isMobile && (
                <div className="p-4 border-t border-border">
                    <div className="flex justify-center gap-8">
                        <Button variant="ghost" className="text-primary hover:text-primary/80">
                            Chat
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                            Favoritos
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface ConversationItemProps {
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
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
        <div
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected 
                    ? "bg-muted border-l-2 border-primary" 
                    : "hover:bg-muted/50"
            }`}
        >
            {/* Avatar con color de fondo */}
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                    <AvatarFallback className={`${getAvatarColor(conversation.user.name)} text-white font-medium`}>
                        {getInitials(conversation.user.name)}
                    </AvatarFallback>
                </Avatar>
                {/* Indicador de estrella favorito */}
                <div className="absolute -top-1 -right-1 text-yellow-400">
                    ⭐
                </div>
                {/* Indicador online */}
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
            </div>

            {/* Información de la conversación */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                        {conversation.user.name}
                    </h3>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {conversation.lastMessageTime}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                        {conversation.isOnline ? "En línea" : conversation.lastMessage || "Sin mensajes"}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground text-xs min-w-[20px] h-5 flex items-center justify-center ml-2">
                            {conversation.unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
