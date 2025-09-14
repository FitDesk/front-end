
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/components/ui/resizable";
import { useEffect, useState } from "react";
import { userData } from "./data";
// import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/core/lib/utils";
import { Chat } from "./components/chat";
import { Link } from "react-router";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shared/components/animated/sidebar";



interface ChatLayoutProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}


export const MessagePage = ({
    defaultLayout = [320, 480],
    defaultCollapsed = false,
    navCollapsedSize
}: ChatLayoutProps) => {

    // removed local isCollapsed state
    const [selectedUser, setSelectedUser] = useState(userData[0]);
    const [isMobile, setIsMobile] = useState(false);

    // use shared sidebar context
    const { state: sidebarState, setOpen } = useSidebar();
    const collapsed = sidebarState === "collapsed" || isMobile;

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
            }}
            className="h-full items-stretch"
        >
            <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={isMobile ? 0 : 24}
                maxSize={isMobile ? 8 : 30}
                onCollapse={() => {
                    // delegate collapsing to SidebarProvider
                    setOpen(false);
                }}
                onExpand={() => {
                    setOpen(true);
                }}
                className={cn(
                    collapsed &&
                    "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out",
                )}
            >
                {/* <Sidebar collapsible="icon"> */}
                <Sidebar variant="inset" collapsible="none" className="h-full">
                    <SidebarHeader>
                        <div className="px-2">
                            <h3 className="font-semibold">Chats</h3>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Mensajes</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {userData.map((user) => (
                                        <SidebarMenuItem key={user.name}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={selectedUser.name === user.name}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Link to="#" className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                    </Avatar>
                                                    <span className="truncate">{user.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                <Chat
                    messages={selectedUser.messages}
                    selectedUser={selectedUser}
                    isMobile={isMobile}
                />
            </ResizablePanel>
        </ResizablePanelGroup >
    );
}