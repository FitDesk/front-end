import { cn } from "@/core/lib/utils";
import { Textarea } from "@/shared/components/ui/textarea";
import * as React from "react";

interface ChatInputProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
    ({ className, ...props }, ref) => (
        <Textarea
            autoComplete="off"
            ref={ref}
            name="message"
            className={cn(
                "min-h-[44px] max-h-32 px-4 py-3 bg-background text-foreground text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-2xl md:rounded-full border border-input resize-y overflow-y-auto",
                className,
            )}
            {...props}
        />
    ),
);
ChatInput.displayName = "ChatInput";

export { ChatInput };