import {
    LayoutDashboard,
    Users,
    BarChart3,
    DollarSign,
    Shield,
    Zap,
    Bell,
    Settings,
    Moon,
    Sun,
    User,
    Dumbbell,
    Calendar,
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
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { title: 'Miembros', icon: Users, href: '/admin/users' },
    { title: 'Entrenadores', icon: Dumbbell, href: '/admin/trainers' },
    { title: 'Clases', icon: Calendar, href: '/admin/classes' },
    { title: 'Facturación', icon: DollarSign, href: '/admin/billing' },
    { title: 'Planes', icon: Shield, href: '/admin/plans' },
    { title: 'Promociones', icon: Zap, href: '/admin/promotions' },
    { title: 'Notificaciones', icon: Bell, href: '/admin/notifications' },
    { title: 'Configuración', icon: Settings, href: '/admin/settings' },
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