import { DashboardCard } from '../components/ui/dashboard-card';
import { RevenueChart } from '../components/ui/revenue-chart';
import { UsersTable } from '../components/ui/users-table';
import { QuickActions } from '../components/ui/quick-actions';
import { RecentActivity } from '../components/ui/recent-activity';
import { Users, Calendar } from 'lucide-react';

const stats = [
    {
        title: 'Alumnos Activos',
        value: '45',
        change: '+5%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        title: 'Clases Hoy',
        value: '8',
        change: '+2 esta semana',
        changeType: 'positive' as const,
        icon: Calendar,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    }
];

const handleAddStudent = () => {
    console.log('Agregando nuevo alumno...');
};

const DashboardTrainer = () => {
    return (
        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
            <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
                    <div className="px-2 sm:px-0">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Panel de Entrenador
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Resumen de tu actividad y estadísticas.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <DashboardCard key={stat.title} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                        {/* Charts Section */}
                        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
                            <RevenueChart
                                title="Progreso de Alumnos"
                                subtitle="Rendimiento general de la semana"
                            />
                            <UsersTable
                                title="Mis Alumnos Recientes"
                                onAddUser={handleAddStudent}
                            />
                        </div>

                        {/* Sidebar Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <QuickActions
                                title="Acciones Rápidas"
                            />

                            <RecentActivity
                                title="Actividad Reciente"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTrainer;