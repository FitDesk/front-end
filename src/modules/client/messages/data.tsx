export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "TRAINER" | "STUDENT";
}

export interface Message {
  id: string;
  text: string;
  fromRole: "TRAINER" | "STUDENT";
  fromId: string;
  toId: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isFavorite: boolean;
}

