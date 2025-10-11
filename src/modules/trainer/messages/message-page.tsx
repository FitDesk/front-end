import { ChatContainer } from "@/shared/components/chat-container";

export function MessagePage() {
    return (
        <div className="h-full">
            <ChatContainer userRole="TRAINER" />
        </div>
    );
}