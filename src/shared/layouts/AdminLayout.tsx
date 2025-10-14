import { useState } from 'react';

import { AdminSidebar } from '@/modules/admin/components/ui/admin-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '../components/animated/sidebar';


export default function AdminDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const handleExport = () => {
        console.log('Exporting data...');
    };



    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <DashboardHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                    isRefreshing={isRefreshing}
                />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}