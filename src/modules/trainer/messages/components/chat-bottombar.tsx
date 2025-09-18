import {
    Mic,
    PlusCircle,
    SendHorizontal,
    ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import useChatStore from "@/core/store/chat.store";
import { loggedInUserData, type Message } from "../data";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { ChatInput } from "./chat-input";

// export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar() {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const setMessages = useChatStore((state) => state.setMessages);
    const hasInitialResponse = useChatStore((state) => state.hasInitialResponse);
    const setHasInitialResponse = useChatStore(
        (state) => state.setHasInitialResponse,
    );
    const [isLoading, setisLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const sendMessage = (newMessage: Message) => {
        useChatStore.setState((state) => ({
            messages: [...state.messages, newMessage],
        }));
    };

    const handleThumbsUp = () => {
        const newMessage: Message = {
            id: message.length + 1,
            name: loggedInUserData.name,
            avatar: loggedInUserData.avatar,
            message: "👍",
        };
        sendMessage(newMessage);
        setMessage("");
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: message.length + 1,
                name: loggedInUserData.name,
                avatar: loggedInUserData.avatar,
                message: message.trim(),
            };
            sendMessage(newMessage);
            setMessage("");

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }

        if (!hasInitialResponse) {
            setisLoading(true);
            setTimeout(() => {
                setMessages((messages) => [
                    ...messages.slice(0, messages.length - 1),
                    {
                        id: messages.length + 1,
                        avatar:
                            "https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350",
                        name: "Jane Doe",
                        message: "Awesome! I am just chilling outside.",
                        timestamp: formattedTime,
                    },
                ]);
                setisLoading(false);
                setHasInitialResponse(true);
            }, 2500);
        }
    }, []);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + "\n");
        }
    };

    return (
        <div className="px-4 py-4 flex justify-between w-full items-center gap-3 bg-card border-t border-border">
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 hover:bg-muted"
                        >
                            <PlusCircle size={20} className="text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-auto p-2 bg-popover border-border">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 hover:bg-muted"
                            >
                                <Mic size={20} className="text-muted-foreground" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <AnimatePresence initial={false}>
                <motion.div
                    key="input"
                    className="flex-1 relative"
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.05 },
                        layout: {
                            type: "spring",
                            bounce: 0.15,
                        },
                    }}
                >
                    <ChatInput
                        value={message}
                        ref={inputRef}
                        onKeyDown={handleKeyPress}
                        onChange={handleInputChange}
                        placeholder="Escribe un mensaje..."
                        className="rounded-full pr-12"
                    />
                </motion.div>

                {message.trim() ? (
                    <Button
                        className="h-10 w-10 shrink-0"
                        onClick={handleSend}
                        disabled={isLoading}
                        variant="default"
                        size="icon"
                    >
                        <SendHorizontal size={20} />
                    </Button>
                ) : (
                    <Button
                        className="h-10 w-10 shrink-0"
                        onClick={handleThumbsUp}
                        disabled={isLoading}
                        variant="ghost"
                        size="icon"
                    >
                        <ThumbsUp size={20} className="text-muted-foreground" />
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
}