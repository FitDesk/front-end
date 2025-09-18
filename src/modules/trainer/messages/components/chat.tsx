import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import type { Message, UserData } from "../data";
import useChatStore from "@/core/store/chat.store";

interface ChatProps {
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ selectedUser, isMobile }: ChatProps) {
  const messagesState = useChatStore((state) => state.messages);

  const sendMessage = (newMessage: Message) => {
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatTopbar selectedUser={selectedUser} />

      <div className="flex-1 overflow-hidden">
        <ChatList
          messages={messagesState}
          selectedUser={selectedUser}
          sendMessage={sendMessage}
          isMobile={isMobile}
        />
      </div>

      <ChatBottombar />
    </div>
  );
}