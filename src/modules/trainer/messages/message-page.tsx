import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Star, RotateCcw, ArrowLeft } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ChatArea } from "./components/chat-area";
import { useConversations } from "./hooks/use-conversations";
import { useToggleFavorite } from "./hooks/use-toggle-favorite";
import type { Conversation } from "./data";

export function MessagePage() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'favorites'>('chat');
    const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'favorites'>('all');

    const { data: conversations = [], isLoading } = useConversations({
        searchTerm,
        filter: chatFilter,
        activeTab
    });
    const toggleFavoriteMutation = useToggleFavorite();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleFavorite = (conversationId: string) => {
        toggleFavoriteMutation.mutate(conversationId);
    };

  
    const conversationsArray = Array.isArray(conversations) ? conversations : [];
    const totalUnreadCount = conversationsArray.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
    const hasUnreadMessages = totalUnreadCount > 0;

   
    if (isMobileView) {
        if (selectedConversation) {
            return (
                <div className="bg-background" style={{ height: 'calc(100vh - 64px)' }}>
                    <ChatArea 
                        conversation={selectedConversation} 
                        onBack={() => setSelectedConversation(null)}
                        isMobile={true}
                        onToggleFavorite={toggleFavorite}
                    />
                </div>
            );
        } else {
            return (
                <div className="bg-background" style={{ height: 'calc(100vh - 64px)' }}>
                    <ConversationsList
                        conversations={conversationsArray}
                        onSelectConversation={setSelectedConversation}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        setChatFilter={setChatFilter}
                        isLoading={isLoading}
                    />
                </div>
            );
        }
    }

    // Vista desktop - sidebar + chat
    return (
        <div className="flex h-full bg-background" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Sidebar de conversaciones */}
            <div className="w-80 border-r border-border bg-card flex flex-col">
                {/* Header con filtros */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    {chatFilter === 'favorites' ? (
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setChatFilter('all')}
                                className="text-muted-foreground hover:text-foreground p-1"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-semibold text-foreground">Favoritos</h1>
                        </div>
                    ) : (
                        
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold text-foreground">Chats</h1>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                                        Filtrar chats por
                                    </div>
                                    <DropdownMenuItem 
                                        onClick={() => setChatFilter('unread')}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        No leídos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setChatFilter('favorites')}
                                    >
                                        <Star className="h-4 w-4 mr-2" />
                                        Favoritos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setChatFilter('all')}
                                    >
                                        Todos los chats
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    {/* Contador de conversaciones */}
                    <p className="text-sm text-muted-foreground mb-4">
                        {activeTab === 'chat' 
                            ? `${conversationsArray.length} ${
                                chatFilter === 'unread' ? 'mensajes no leídos' :
                                chatFilter === 'favorites' ? 'favoritos' :
                                'conversaciones activas'
                              }`
                            : `${conversationsArray.length} favoritos`
                        }
                    </p>

                    {/* Barra de búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={
                                chatFilter === 'unread' ? 'Busca en chats no leídos' :
                                chatFilter === 'favorites' ? 'Buscar en favoritos...' :
                                'Buscar conversaciones...'
                            }
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Lista de conversaciones */}
                <div className="flex-1 overflow-y-auto p-2 min-h-0">
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
                    ) : conversationsArray.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-lg font-medium mb-2">No hay conversaciones</h3>
                            <p className="text-center text-muted-foreground/70">
                                Cuando tengas conversaciones con estudiantes, aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        conversationsArray.map((conversation: Conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={conversation.id === selectedConversation?.id}
                                onClick={() => setSelectedConversation(conversation)}
                            />
                        ))
                    )}
                </div>

                {/* Footer con navegación Chat - Favoritos */}
                <div className="p-4 border-t border-border flex-shrink-0">
                    <div className="flex bg-muted/50 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 rounded-md transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'chat'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            Chat
                            {hasUnreadMessages && (
                                <div className="w-2 h-2 bg-background rounded-full"></div>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('favorites')}
                            className={`flex-1 rounded-md transition-all ${
                                activeTab === 'favorites'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            <Star className="h-4 w-4 mr-1" />
                            Favoritos
                        </Button>
                    </div>
                </div>
            </div>

            {/* Área de chat */}
            <div className="flex-1">
                {selectedConversation ? (
                    <ChatArea 
                        conversation={selectedConversation} 
                        onToggleFavorite={toggleFavorite}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-medium mb-2">Selecciona una conversación</h3>
                            <p className="text-muted-foreground/70">Elige una conversación de la lista para comenzar a chatear</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ConversationsList({
    conversations,
    onSelectConversation,
    searchTerm,
    onSearchChange,
    setChatFilter,
    isLoading,
}: {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    setChatFilter?: (filter: 'all' | 'unread' | 'favorites') => void;
    isLoading: boolean;
}) {
    

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header móvil */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-foreground">Chats</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                                Filtrar chats por
                            </div>
                            <DropdownMenuItem 
                                onClick={() => setChatFilter?.('unread')}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                No leídos
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setChatFilter?.('favorites')}
                            >
                                <Star className="h-4 w-4 mr-2" />
                                Favoritos
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setChatFilter?.('all')}
                            >
                                Todos los chats
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    {conversations.length} conversaciones activas
                </p>

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

            {/* Lista */}
            <div className="flex-1 overflow-y-auto p-2">
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
                ) : (
                    conversations.map((conversation: Conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={false}
                            onClick={() => onSelectConversation(conversation)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}


function ConversationItem({ conversation, isSelected, onClick }: {
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
}) {
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
                {conversation.isFavorite && (
                    <div className="absolute -top-1 -right-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                    </div>
                )}
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
