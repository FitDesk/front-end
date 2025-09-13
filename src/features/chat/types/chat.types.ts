export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface SendMessageRequest {
  message: string;
  // Agregar campos según lo que necesite el backend
  // ejmp: userId, sessionId, etc.
}

export interface SendMessageResponse {
  response: string;
  // campos según lo que devuelva tu backend+
}
