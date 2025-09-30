import { useState } from "react";

interface ChatBottombarProps {
    onSendMessage: (content: string) => void;
}

export default function ChatBottombar({ onSendMessage }: ChatBottombarProps) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <div className="px-4 py-4 flex justify-between w-full items-center gap-3 bg-card border-t border-border">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 border rounded-full px-4 py-2"
            />
            <button type="button" onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded-full">
                Enviar
            </button>

        </div>
    );
}