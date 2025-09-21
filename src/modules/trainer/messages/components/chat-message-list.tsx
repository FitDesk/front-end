import * as React from "react";
import { ArrowDown } from "lucide-react";
import { useAutoScroll } from "@/core/hooks/use-auto-scroll";
import { Button } from "@/shared/components/ui/button";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
    smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
    ({ className, children, smooth = false, ...props }, _ref) => {
        const {
            scrollRef,
            isAtBottom,
            // autoScrollEnabled,
            scrollToBottom,
            disableAutoScroll,
        } = useAutoScroll({
            smooth,
            content: children,
        });

        return (
            <div className="relative w-full h-full bg-background">
                <div
                    className={`flex flex-col w-full h-full overflow-y-auto scroll-smooth chat-message-list ${className}`}
                    ref={scrollRef}
                    onWheel={disableAutoScroll}
                    onTouchMove={disableAutoScroll}
                    {...props}
                >
                    <div className="flex flex-col gap-1 py-4">{children}</div>
                </div>

                {!isAtBottom && (
                    <Button
                        onClick={() => {
                            scrollToBottom();
                        }}
                        size="icon"
                        variant="outline"
                        className="absolute bottom-4 right-4 inline-flex rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-card border-border hover:bg-muted"
                        aria-label="Scroll to bottom"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    },
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };