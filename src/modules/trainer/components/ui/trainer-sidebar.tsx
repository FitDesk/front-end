import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    Dumbbell,
    Utensils,
    Settings,
    User,
    BarChart3,
    MessageSquare,
    FileText,
} from 'lucide-react';
import { memo } from 'react';
import {
    Sidebar,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
} from '@/shared/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
// Theme provider import removed as it's not being used
import { Button } from '@/shared/components/ui/button';

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
];

const settingsItems = [
    { title: 'Mi Perfil', icon: User, href: '/trainer/profile' },
    { title: 'Configuración', icon: Settings, href: '/trainer/settings' },
];

const TrainerSidebar = memo(() => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Sidebar className="border-r">
            <SidebarHeader>
                <SidebarGroup>
                    <SidebarRail />
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Menú</SidebarGroupLabel>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                            isActive(item.href)
                                                ? 'bg-muted font-medium text-primary'
                                                : 'text-muted-foreground hover:bg-muted/50'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Configuración</SidebarGroupLabel>
                    <SidebarMenu>
                        {settingsItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-muted font-medium text-primary'
                                            : 'text-muted-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarHeader>

            <div className="p-4 border-t mt-auto">
                <Button variant="outline" className="w-full">
                    Cerrar Sesión
                </Button>
            </div>
        </Sidebar>
    );
});

TrainerSidebar.displayName = 'TrainerSidebar';

export default TrainerSidebar;
