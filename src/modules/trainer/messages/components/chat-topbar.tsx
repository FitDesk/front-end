import { Info, Phone, Video } from "lucide-react";
import type { UserData } from "../data";
import { ExpandableChatHeader } from "./expandable-chat";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Link } from "react-router";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/core/lib/utils";

interface ChatTopbarProps {
    selectedUser: UserData;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
    return (
        <ExpandableChatHeader>
            <div className="flex items-center gap-2">
                <Avatar className="flex justify-center items-center">
                    <AvatarImage
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        width={6}
                        height={6}
                        className="w-10 h-10 "
                    />
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{selectedUser.name}</span>
                    <span className="text-xs">Active 2 mins ago</span>
                </div>
            </div>

            <div className="flex gap-1">
                {TopbarIcons.map((icon, index) => (
                    <Link
                        // biome-ignore lint/suspicious/noArrayIndexKey: <>
                        key={index}
                        to="#"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-9 w-9",
                        )}
                    >
                        <icon.icon size={20} className="text-muted-foreground" />
                    </Link>
                ))}
            </div>
        </ExpandableChatHeader>
    );
}