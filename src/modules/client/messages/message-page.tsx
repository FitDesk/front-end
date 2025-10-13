import { ChatContainer } from "@/shared/components/chat-container";
export function ClientMessagePage() {
     return (
    <div className="h-full">
      <ChatContainer userRole="USER" />
    </div>
  );
}