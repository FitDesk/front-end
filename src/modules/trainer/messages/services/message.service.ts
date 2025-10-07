import { fitdeskApi } from "@/core/api/fitdeskApi";
import { webSocketService } from "@/core/services/web-socket.service";
import type { Conversation, Message } from "../data";

interface SendMessageParams {
    conversationId: string;
    text: string;
    toUserId: string;
}

interface SendMessageRequest {
    roomId: string;
    fromId: string;
    fromRole: "TRAINER" | "STUDENT";
    text: string;
}

interface ConversationFilters {
    searchTerm?: string;
    filter?: 'all' | 'unread' | 'favorites';
    activeTab?: 'chat' | 'favorites';
}

class MessageService {
  
    async getConversations(filters: ConversationFilters = {}): Promise<Conversation[]> {
        try {
            const params = new URLSearchParams();
            
            if (filters.searchTerm) {
                params.append('search', filters.searchTerm);
            }
            if (filters.filter && filters.filter !== 'all') {
                params.append('filter', filters.filter);
            }
            if (filters.activeTab && filters.activeTab !== 'chat') {
                params.append('tab', filters.activeTab);
            }
            
            const queryString = params.toString();
            const url = `/trainer/messages/conversations${queryString ? `?${queryString}` : ''}`;
            
            const response = await fitdeskApi.get<Conversation[]>(url);
            return response.data || [];
        } catch (error: unknown) {
            console.error("Error fetching conversations:", error);
            throw error; 
        }
    }

   
    async getMessages(conversationId: string): Promise<Message[]> {
        try {
            const response = await fitdeskApi.get<Message[]>(`/trainer/messages/conversations/${conversationId}/messages`);
            return response.data || [];
        } catch (error: unknown) {
            console.error("Error fetching messages:", error);
            throw error; 
        }
    }

    /**
     * Enviar un mensaje usando WebSocket
     */
    async sendMessage(params: SendMessageParams): Promise<void> {
        const { conversationId, text, toUserId } = params;
        
    
        const trainerId = localStorage.getItem('trainerId') || 'trainer-1';
        
        const messageData: SendMessageRequest = {
            roomId: conversationId,
            fromId: trainerId,
            fromRole: "TRAINER",
            text,
        };

        if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
            await webSocketService.connect(conversationId, () => {});
        }
        webSocketService.sendMessage(messageData);
        try {
            await fitdeskApi.post(`/trainer/messages/conversations/${conversationId}/messages`, {
                text,
                toUserId,
            });
        } catch (error: unknown) {
            console.error("Error sending message via API:", error);
        }
    }

    /**
     * Marcar conversación como leída
     */
    async markAsRead(conversationId: string): Promise<void> {
        try {
            await fitdeskApi.patch(`/trainer/messages/conversations/${conversationId}/read`);
        } catch (error: unknown) {
            console.error("Error marking conversation as read:", error);
        }
    }

    async toggleFavorite(conversationId: string): Promise<void> {
        try {
            await fitdeskApi.patch(`/trainer/messages/conversations/${conversationId}/favorite`);
        } catch (error: unknown) {
            console.error("Error toggling favorite:", error);
            throw error;
        }
    }

}

export const messageService = new MessageService();
