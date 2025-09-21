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
    Dumbbell,
    Calendar,
    MapPin,
    LogOut,
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
    useSidebar,
} from '@/shared/components/animated/sidebar';
import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { ThemeTogglerButton } from '@/shared/components/animated/theme-toggler';
import { User } from '@/shared/components/animated/icons/user';
import { cn } from '@/core/lib/utils';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { title: 'Miembros', icon: Users, href: '/admin/members' },
    { title: 'Entrenadores', icon: Dumbbell, href: '/admin/trainers' },
    { title: 'Clases', icon: Calendar, href: '/admin/classes' },
    { title: 'Ubicaciones', icon: MapPin, href: '/admin/locations' },
    { title: 'Facturación', icon: DollarSign, href: '/admin/billing' },
    { title: 'Planes', icon: Shield, href: '/admin/plans' },
    { title: 'Promociones', icon: Zap, href: '/admin/promotions' },
    { title: 'Notificaciones', icon: Bell, href: '/admin/notifications' },
    { title: 'Configuración', icon: Settings, href: '/admin/settings' },
];

export const AdminSidebar = memo(() => {
    const { state, } = useSidebar()
    const isCollapsed = state === 'collapsed'
    const togglerWrapperClass = cn(
        "p-0",
        // when collapsed center the item; when expanded keep it at start and add small padding
        isCollapsed ? "flex justify-center" : "flex justify-start pl-2"
    )
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link prefetch='none' to="/admin" viewTransition className="flex items-center gap-2">
                                {isCollapsed ? (
                                    <img
                                        src="/src/assets/logo.svg"
                                        alt="App Logo"
                                        loading="lazy"
                                        className="h-10 w-10"
                                    />
                                ) : (
                                    <>
                                        <img
                                            src="/favicon.svg"
                                            alt="App Logo"
                                            loading="lazy"
                                            className="h-20 w-20"
                                        />
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">TechCorp</span>
                                            <span className="truncate text-xs">Panel Administrador</span>
                                        </div>
                                    </>
                                )}
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
                    <SidebarMenuItem className={togglerWrapperClass}>
                        <SidebarMenuButton className="flex w-full justify-center p-0">
                            <ThemeTogglerButton showLabel="auto" variant="ghost" direction='bottom-left' />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link prefetch='none' to="#profile" viewTransition>
                                <User animateOnHover />
                                <span>Perfil Administrador</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        {isCollapsed ? (
                            <SidebarMenuButton asChild>
                                <Button variant="destructive" size="icon">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Cerrar Sesión</span>
                                </Button>
                            </SidebarMenuButton>

                        ) : (
                            <SidebarMenuButton asChild>
                                <Button variant={'destructive'}>
                                    Cerrar Sesion
                                </Button>
                            </SidebarMenuButton>
                        )}

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
});

AdminSidebar.displayName = 'AdminSidebar';