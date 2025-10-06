import { fitdeskApi } from "@/core/api/fitdeskApi";
import type { SendMessageRequest, SendMessageResponse } from "../types/chat.types";

class ChatService {
  private static instance: ChatService;
  private basePath = '/api/chat'; //ruta  backend

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async sendMessage(messageData: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fitdeskApi.post<SendMessageResponse>(
        `${this.basePath}/message`,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  public async searchConversations(query: string): Promise<unknown[]> {
    try {
      const response = await fitdeskApi.get<unknown[]>(
        `${this.basePath}/conversations/search`,
        {
          params: { q: query }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  public async getConversations(): Promise<unknown[]> {
    try {
      const response = await fitdeskApi.get<unknown[]>(
        `${this.basePath}/conversations`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener conversaciones:', error);
      return [];
    }
  }
}

export const chatService = ChatService.getInstance();
