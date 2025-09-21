
import { useEffect, useState } from "react";
import { cn } from "@/core/lib/utils";
import { Chat } from "./components/chat";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Star, StarOff, MoreVertical, ChevronLeft, Search, Loader2, MessageSquare } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import useChatStore from "@/core/store/chat.store";

export const MessagePage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationList, setShowConversationList] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const { 
        selectedUser,
        conversations,
        searchQuery,
        isSearching,
        searchError,
        setSelectedUser,
        setSearchQuery,
        searchConversations,
        favorites,
        toggleFavorite
    } = useChatStore();

    useEffect(() => {
        const checkScreenWidth = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowConversationList(true);
            }
        };

        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchConversations(searchQuery);
        }, 300); 

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchConversations]);

    const getLastMessage = (user: any) => {
        if (user.messages && user.messages.length > 0) {
            
            const validMessages = user.messages.filter((msg: any) => !msg.isLoading && msg.message);
            if (validMessages.length > 0) {
                const lastMsg = validMessages[validMessages.length - 1];
                return lastMsg.message;
            }
        }
        return "No hay mensajes";
    };

    const getLastMessageTime = (user: any) => {
        if (user.messages && user.messages.length > 0) {
            const validMessages = user.messages.filter((msg: any) => !msg.isLoading && msg.timestamp);
            if (validMessages.length > 0) {
                const lastMsg = validMessages[validMessages.length - 1];
                return lastMsg.timestamp;
            }
        }
        return "";
    };

    const handleSelectUser = (user: any) => {
        setSelectedUser(user);
        if (isMobile) setShowConversationList(false);
    }

    const renderConversationList = () => (
        <div className={cn(
            "flex-shrink-0 border-r bg-card transition-all duration-300 h-full absolute md:relative z-10",
            isMobile ? (showConversationList ? "w-full" : "hidden") : "w-80"
           
        )}>
            <div className="h-full flex flex-col">
                {/* Header del sidebar - Solo visible en desktop */}
                {!isMobile && (
                    <div className="p-4 border-b bg-card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground">Mensajes</h2>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5 text-foreground" />
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                            {conversations.length} conversaciones activas
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar conversaciones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                            )}
                        </div>
                        {searchError && (
                            <div className="text-sm text-red-500 mt-2">
                                {searchError}
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de conversaciones */}
                <div className="flex-1 overflow-y-auto bg-card">
                    {conversations
                        .filter(user => activeTab === 'chat' || favorites.includes(user.id.toString()))
                        .map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center p-4 hover:bg-muted/50 cursor-pointer",
                                selectedUser?.id === user.id && "bg-muted/50"
                            )}
                            onClick={() => handleSelectUser(user)}
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium truncate text-foreground">{user.name}</h3>
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {getLastMessage(user)}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">{getLastMessageTime(user)}</span>
                                {user.unreadCount && user.unreadCount > 0 && (
                                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {user.unreadCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navegación inferior - Solo visible en desktop */}
                {!isMobile && (
                    <div className="p-4 border-t bg-card">
                        <div className="flex gap-2">
                            <Button 
                                variant={activeTab === 'chat' ? 'default' : 'outline'} 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setActiveTab('chat')}
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${activeTab === 'chat' ? 'bg-primary-foreground' : 'bg-transparent'}`}></div>
                                Chat
                            </Button>
                            <Button 
                                variant={activeTab === 'favorites' ? 'default' : 'outline'} 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setActiveTab('favorites')}
                            >
                                <Star className={`h-4 w-4 mr-2 ${activeTab === 'favorites' ? 'fill-primary-foreground' : ''}`} />
                                Favoritos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Contenido principal con scroll */}
            <div className="flex h-[calc(100vh-4rem)] bg-background">
                {/* Sidebar */}
                <div className={cn(
                    "w-full md:w-80 border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
                    !showConversationList && "hidden md:flex"
                )}>
                    {renderConversationList()}
                </div>
                
                {/* Área de chat */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedUser ? (
                        <div className="flex flex-col h-full">
                            {/* Header del chat */}
                            <div className="border-b p-4 flex items-center justify-between bg-card">
                                <div className="flex items-center space-x-3">
                                    {isMobile && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setShowConversationList(true)}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                    )}
                                    <Avatar>
                                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                        <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{selectedUser.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {'En línea'}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(selectedUser.id.toString());
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {favorites.includes(selectedUser.id.toString()) ? (
                                                <>
                                                    <StarOff className="mr-2 h-4 w-4" />
                                                    Quitar de favoritos
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="mr-2 h-4 w-4" />
                                                    Añadir a favoritos
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            {/* Componente de chat */}
                            <div className="flex-1 overflow-hidden">
                                <Chat 
                                    selectedUser={selectedUser}
                                    isMobile={isMobile}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center space-y-2 p-4">
                                <h3 className="text-lg font-medium">Selecciona una conversación</h3>
                                <p className="text-sm text-muted-foreground">
                                    Elige un chat para empezar a enviar mensajes
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Bottom Navigation - Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex flex-col items-center p-2 w-1/2 ${activeTab === 'chat' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <MessageSquare className={`h-6 w-6 ${activeTab === 'chat' ? 'text-primary' : ''}`} />
                    <span className="text-xs mt-1">Chat</span>
                </button>
                <div className="h-8 w-px bg-gray-200 my-2" />
                <button 
                    onClick={() => setActiveTab('favorites')}
                    className={`flex flex-col items-center p-2 w-1/2 ${activeTab === 'favorites' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <Star className={`h-6 w-6 ${activeTab === 'favorites' ? 'text-primary fill-primary' : ''}`} />
                    <span className="text-xs mt-1">Favoritos</span>
                </button>
            </div>
        </div>
    );
}