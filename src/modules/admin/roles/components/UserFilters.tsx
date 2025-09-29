import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Search, X } from 'lucide-react';
import type { UserRole } from '../types';

interface UserFiltersProps {
  filters: {
    searchTerm?: string;
    role?: UserRole;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  };
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleFilter: (role: string) => void;
  onStatusFilter: (status: string) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function UserFilters({ 
  filters, 
  onSearch, 
  onRoleFilter, 
  onStatusFilter, 
  onReset,
  isLoading 
}: UserFiltersProps) {
  const isFilterActive = Boolean(
    filters.role || 
    filters.status ||
    (filters.searchTerm && filters.searchTerm.length > 0)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-10 py-6 text-base"
          value={filters.searchTerm || ''}
          onChange={onSearch}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Role Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Filtrar por rol</label>
          <Select
            value={filters.role || 'ALL'}
            onValueChange={onRoleFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los roles</SelectItem>
              <SelectItem value="ADMIN">Administradores</SelectItem>
              <SelectItem value="TRAINER">Entrenadores</SelectItem>
              <SelectItem value="MEMBER">Miembros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Filtrar por estado</label>
          <Select
            value={filters.status || 'ALL'}
            onValueChange={onStatusFilter}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
              <SelectItem value="SUSPENDED">Suspendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={!isFilterActive || isLoading}
            className="h-10"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
