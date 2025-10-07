

export interface Message {
    id: string;
    roomId: string;
    fromId: string;
    fromRole: "TRAINER" | "STUDENT";
    text: string;
    createdAt: string;
}

export interface User {
    id: string;
    avatar: string;
    name: string;
}

export interface Conversation {
    id: string;
    user: User;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isOnline: boolean;
    isFavorite?: boolean;
}

export interface ConversationWithMessages extends Conversation {
    messages: Message[];
}