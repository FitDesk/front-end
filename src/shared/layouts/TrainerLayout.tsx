'use client';

import { useState } from 'react';
import TrainerSidebar from '@/modules/trainer/components/ui/trainer-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '../components/animated/sidebar';

export default function TrainerLayout() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRefresh = async () => {
        setIsRefreshing(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleExport = () => {
        console.log('Exporting data...');
    };

    return (
        <SidebarProvider>
            <TrainerSidebar />
            <SidebarInset>
                <DashboardHeader
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                    isRefreshing={isRefreshing}
                />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
