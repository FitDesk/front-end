import type { Message } from "@/modules/trainer/messages/data";

class WebSocketService {
    private static instance: WebSocketService;
    private constructor() { }
    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    socket: WebSocket | null = null;

    connect(roomId: string, onMessage: (message: Message) => void) {
        this.socket = new WebSocket(`ws://localhost:9096/ws/chat/${roomId}`);
        this.socket.onopen = () => console.log("WebSocket conectado a la sala:", roomId);
        this.socket.onmessage = (event) => onMessage(JSON.parse(event.data));
        this.socket.onerror = (error) => console.error("Error en WebSocket:", error);
        this.socket.onclose = () => console.warn("WebSocket cerrado.");
    }

    sendMessage(message: Omit<Message, "id" | "createdAt" |"roomId" >) {
        console.log("Estado del WebSocket al enviar mensaje:", this.socket?.readyState);

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("No se puede enviar el mensaje. WebSocket no está conectado.");
            // Opcional: intenta reconectar si el socket está cerrado
            if (this.socket?.readyState === WebSocket.CLOSED) {
                console.warn("Intentando reconectar WebSocket...");
                // this.connect(message.roomId, () => { });
            }
        }
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}

export const webSocketService = WebSocketService.getInstance();