import {
    Users,
    Calendar,
    ClipboardList,
    Dumbbell,
    Utensils,
    User,
    BarChart3,
    MessageSquare,
    FileText,
    Sun,
    Moon,
    LayoutDashboard,
    Settings,
    LogOut,
} from 'lucide-react';
import { memo } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, useSidebar } from '@/shared/components/animated/sidebar';
import { useTheme } from '@/core/providers/theme-provider';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/trainer' },
    { title: 'Mi Calendario', icon: Calendar, href: '/trainer/calendar' },
    { title: 'Asistencia', icon: ClipboardList, href: '/trainer/attendance' },
    { title: 'Mis Alumnos', icon: Users, href: '/trainer/students' },
    { title: 'Rutinas', icon: Dumbbell, href: '/trainer/workouts' },
    { title: 'Nutrición', icon: Utensils, href: '/trainer/nutrition' },
    { title: 'Estadísticas', icon: BarChart3, href: '/trainer/stats' },
    { title: 'Mensajes', icon: MessageSquare, href: '/trainer/messages' },
    { title: 'Reportes', icon: FileText, href: '/trainer/reports' },
    { title: 'Configuración', icon: Settings, href: '/trainer/settings' },
];


const TrainerSidebar = memo(() => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const { theme, setTheme } = useTheme();
    const { state, } = useSidebar()
    const isCollapsed = state === 'collapsed'
    return (
        // <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link prefetch='none' to="/trainer" viewTransition >
                                    <img
                                        src="/favicon.svg"
                                        alt="App Logo"
                                        loading="lazy"
                                        className="h-20 w-20"
                                    />
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">TechCorp</span>
                                        <span className="truncate text-xs">Panel Entrenador</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarRail /> */}
                        <SidebarGroupLabel>Navegacion</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    to={item.href}
                                                    prefetch='none'
                                                    viewTransition
                                                // className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive(item.href)
                                                //     ? 'bg-muted font-medium text-primary'
                                                //     : 'text-muted-foreground hover:bg-muted/50'
                                                //     }`}
                                                >
                                                    {/* <item.icon className="h-5 w-5" /> */}
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                    )
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
                                <Link prefetch='none' to="/trainer/profile" viewTransition>
                                    <User />
                                    <span>Perfil Entrenador</span>
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
        // </SidebarProvider>
    );
});

TrainerSidebar.displayName = 'TrainerSidebar';

export default TrainerSidebar;
