import { DashboardCard } from '../components/ui/dashboard-card'
import { RevenueChart } from '../components/ui/revenue-chart'
import { UsersTable } from '../components/ui/users-table'
import { QuickActions } from '../components/ui/quick-actions'
import { RecentActivity } from '../components/ui/recent-activity'
import { dashboardStats } from './store/dashboard-data'
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'

const handleAddUser = () => {
    console.log('Adding new user...');
};

const DashboardPage = () => {
    
    useKeyboardShortcuts();
    return (
        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
            <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
                    <div className="px-2 sm:px-0">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Bienvenido 
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Here&apos;s what&apos;s happening with your platform today.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        {dashboardStats.map((stat, index) => (
                            <DashboardCard key={stat.title} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                        {/* Charts Section */}
                        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
                            <RevenueChart />
                            <UsersTable onAddUser={handleAddUser} />
                        </div>

                        {/* Sidebar Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <QuickActions
                                onAddUser={handleAddUser}
                                onExport={() => alert("Exportar")}
                            />
                        
                            <RecentActivity />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;