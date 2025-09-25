'use client';

import { useState } from 'react';
import { Outlet } from 'react-router';
import ClientSidebar from '@/modules/client/components/ui/client-sidebar';
import { DashboardHeader } from '@/modules/admin/components/ui/dashboard-header';
import { Toaster } from '@/shared/components/ui/sonner';
import { SidebarInset, SidebarProvider } from '../components/animated/sidebar';

export default function ClientDashboardLayout() {
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
      <ClientSidebar />
      <SidebarInset className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isRefreshing={isRefreshing}
        />
        <main className="flex-1 bg-background">
          <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              <Outlet />
            </div>
          </div>
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
