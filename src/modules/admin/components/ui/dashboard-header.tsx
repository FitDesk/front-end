import { memo } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Search,
    Filter,
    Download,
    RefreshCw,
    MoreHorizontal,
} from 'lucide-react';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Separator } from '@/shared/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/shared/components/ui/breadcrumb';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { ModeToggle } from '@/shared/components/mode-toggle';

interface DashboardHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onRefresh: () => void;
    onExport: () => void;
    isRefreshing: boolean;
}

export const DashboardHeader = memo(
    ({
        searchQuery,
        onSearchChange,
        onRefresh,
        onExport,
        isRefreshing,
    }: DashboardHeaderProps) => {
        return (
            <header className="bg-background/95 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="ml-auto flex items-center gap-2 px-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        {/* Search Input - Hide on Mobile */}
                        <div className="relative hidden md:block">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-64 pl-10"
                            />
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden items-center gap-2 md:flex">
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>

                            <Button variant="outline" size="sm" onClick={onExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw
                                    className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                                Refresh
                            </Button>
                        </div>

                        {/* Mobile Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="md:hidden">
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => onSearchChange('')} >
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </DropdownMenuItem>
                                <DropdownMenuItem  className='cursor-pointer'>
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtrar
                                </DropdownMenuItem>
                                <DropdownMenuItem  className='cursor-pointer' onClick={onExport}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Exportar
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer' onClick={onRefresh}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Recargar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </header>
        );
    },
);

DashboardHeader.displayName = 'DashboardHeader';