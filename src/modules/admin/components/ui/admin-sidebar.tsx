import {
    LayoutDashboard,
    Users,
    BarChart3,
    FileText,
    Activity,
    Database,
    Shield,
    Zap,
    Bell,
    Settings,
    Moon,
    Sun,
    User,
} from 'lucide-react';
import { memo } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/shared/components/ui/sidebar';
import { Link } from 'react-router';
import { useTheme } from '@/core/providers/theme-provider';
const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
    { title: 'Analytics', icon: BarChart3, href: '#analytics' },
    { title: 'Users', icon: Users, href: '#users' },
    { title: 'Content', icon: FileText, href: '#content' },
    { title: 'Activity', icon: Activity, href: '#activity' },
    { title: 'Database', icon: Database, href: '#database' },
    { title: 'Security', icon: Shield, href: '#security' },
    { title: 'Performance', icon: Zap, href: '#performance' },
    { title: 'Notifications', icon: Bell, href: '#notifications' },
    { title: 'Settings', icon: Settings, href: '#settings' },
];

export const AdminSidebar = memo(() => {
    const { theme, setTheme } = useTheme();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link prefetch='none' to="/admin" viewTransition >
                                <img
                                    src="/favicon.svg"
                                    alt="App Logo"
                                    loading="lazy"
                                    className="h-20 w-20"
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">TechCorp</span>
                                    <span className="truncate text-xs">Admin Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegacion</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild>
                                            <Link prefetch='none' to={item.href} viewTransition>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='cursor-pointer'
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <Sun /> : <Moon />}
                            <span >{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link prefetch='none' to="#profile" viewTransition>
                                <User />
                                <span>Admin Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
});

AdminSidebar.displayName = 'AdminSidebar';