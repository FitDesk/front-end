'use client';

import { useState } from 'react';
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar';
import TrainerSidebar from '@/modules/trainer/components/ui/trainer-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Outlet } from 'react-router';

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
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
