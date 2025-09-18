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

  public async searchConversations(query: string): Promise<any[]> {
    try {
      const response = await fitdeskApi.get<any[]>(
        `${this.basePath}/conversations/search`,
        {
          params: { q: query }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar conversaciones:', error);
      throw error;
    }
  }

  public async getConversations(): Promise<any[]> {
    try {
      const response = await fitdeskApi.get<any[]>(
        `${this.basePath}/conversations`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener conversaciones:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();
