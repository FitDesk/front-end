
import { useEffect, useState } from "react";
import { cn } from "@/core/lib/utils";
import { Chat } from "./components/chat";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { useSidebar } from "@/shared/components/animated/sidebar";
import { Input } from "@/shared/components/ui/input";
import { Search, MoreVertical, Star, Crown, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import useChatStore from "@/core/store/chat.store";



export const MessagePage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationList, setShowConversationList] = useState(false);
    
   
    const {
        selectedUser,
        conversations,
        searchQuery,
        isSearching,
        searchError,
        setSelectedUser,
        setSearchQuery,
        searchConversations
    } = useChatStore();

   
    const { state: sidebarState } = useSidebar();
    const collapsed = sidebarState === "collapsed" || isMobile;

    useEffect(() => {
        const checkScreenWidth = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowConversationList(false);
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
        }, 300); // 300ms de delay

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


    const renderConversationList = () => (
        <div className={cn(
            "flex-shrink-0 border-r bg-card transition-all duration-300 h-full absolute md:relative z-10",
            isMobile ? (showConversationList ? "w-full" : "hidden") : "w-80",
            collapsed && !isMobile && "w-16"
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
                    {conversations.map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50",
                                selectedUser.id === user.id && "bg-muted/80"
                            )}
                            onClick={() => {
                                setSelectedUser(user);
                                if (isMobile) setShowConversationList(false);
                            }}
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
                                    <Crown className="h-4 w-4 text-purple-500" />
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
                            <Button variant="default" size="sm" className="flex-1">
                                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-2"></div>
                                Chat
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                                <Star className="h-4 w-4 mr-2" />
                                Favoritos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full flex bg-background relative">
          
            {renderConversationList()}

            {/* Panel principal del chat */}
            <div className={cn(
                "flex-1 flex flex-col w-full",
                isMobile && !showConversationList ? "block" : "hidden md:flex"
            )}>
                {isMobile && !showConversationList && (
                    <div className="flex items-center p-2 border-b bg-card">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden mr-2"
                            onClick={() => setShowConversationList(true)}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs">
                                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="font-medium">{selectedUser.name}</h2>
                        </div>
                    </div>
                )}
                <Chat
                    selectedUser={selectedUser}
                    isMobile={isMobile}
                />
            </div>
        </div>
    );
}