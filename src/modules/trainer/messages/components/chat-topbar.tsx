import { Info, Phone, Video, Star, Crown } from "lucide-react";
import type { UserData } from "../data";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Link } from "react-router";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/core/lib/utils";

interface ChatTopbarProps {
    selectedUser: UserData;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b bg-card border-border">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    <AvatarImage
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-12 h-12"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-foreground">{selectedUser.name}</span>
                        <Crown className="h-4 w-4 text-purple-500" />
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <Link
                    to="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-10 w-10",
                    )}
                >
                    <Phone className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                    to="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-10 w-10",
                    )}
                >
                    <Video className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                    to="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-10 w-10",
                    )}
                >
                    <Info className="h-5 w-5 text-muted-foreground" />
                </Link>
            </div>
        </div>
    );
}