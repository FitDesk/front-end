import { AnimatePresence, motion } from "framer-motion";
import { Forward, Heart, Plus } from "lucide-react";
import type { Message, User } from "../data";
import { ChatMessageList } from "./chat-message-list";
import { ChatBubble, ChatBubbleAction, ChatBubbleActionWrapper, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleTimestamp } from "./chat-bubble";

interface ChatListProps {
    messages: Message[];
    selectedUser: User;
    sendMessage?: (newMessage: Message) => void;
    isMobile?: boolean;
}

const getMessageVariant = (fromId: string, selectedUserId: string) =>
    fromId !== selectedUserId ? "sent" : "received";

export function ChatList({
    messages,
    selectedUser,
}: ChatListProps) {
    const actionIcons = [
        { icon: Plus, type: "More" },
        { icon: Forward, type: "Like" },
        { icon: Heart, type: "Share" },
    ];

    return (
        <div className="w-full h-full flex flex-col">
            <ChatMessageList smooth={true}>
                <AnimatePresence>
                    {messages.map((message, index) => {
                        const variant = getMessageVariant(message.fromId, selectedUser.id);
                        return (
                            <motion.div
                                key={`${message.id}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 1, y: -20, x: 0 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    layout: {
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.3,
                                    },
                                }}
                                style={{ originX: 0.5, originY: 0.5 }}
                                className="flex flex-col gap-2 px-4 py-2"
                            >
                                <ChatBubble variant={variant}>
                                    <ChatBubbleAvatar src={selectedUser.avatar} />
                                    <ChatBubbleMessage>
                                        {message.text}
                                        {message.createdAt && (
                                            <ChatBubbleTimestamp timestamp={new Date(message.createdAt).toLocaleTimeString()} />
                                        )}
                                    </ChatBubbleMessage>
                                    <ChatBubbleActionWrapper>
                                        {actionIcons.map(({ icon: Icon, type }) => (
                                            <ChatBubbleAction
                                                className="size-7"
                                                key={type}
                                                icon={<Icon className="size-4" />}
                                                onClick={() =>
                                                    console.log(
                                                        `Action ${type} clicked for message ${index}`,
                                                    )
                                                }
                                            />
                                        ))}
                                    </ChatBubbleActionWrapper>
                                </ChatBubble>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </ChatMessageList>
        </div>
    );
}