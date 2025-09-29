
import { useEffect, useState, useMemo } from 'react';
import useRoleStore from '../store/useRoleStore';
import { toast } from 'sonner';
import type { UserRole, UserWithRole } from '../types';
import { UserFilters } from '../components/UserFilters';
import { UserTable } from '../components/UserTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface UserStats {
  total: number;
  admins: number;
  trainers: number;
  members: number;
  active: number;
  inactive: number;
  suspended: number;
}

export default function UserRolesPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    users,
    fetchUsers,
    setUserFilters, 
    userFilters = {},
    updateUserRole
  } = useRoleStore();
  
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Error al cargar los usuarios', {
          description: error instanceof Error ? error.message : 'Por favor, intente nuevamente.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [fetchUsers, userFilters]);
  
  
  const stats: UserStats = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return {
        total: 0,
        admins: 0,
        trainers: 0,
        members: 0,
        active: 0,
        inactive: 0,
        suspended: 0
      };
    }
    
    return {
      total: users.length,
      admins: users.filter((u: UserWithRole) => u.role === 'ADMIN').length,
      trainers: users.filter((u: UserWithRole) => u.role === 'TRAINER').length,
      members: users.filter((u: UserWithRole) => u.role === 'MEMBER').length,
      active: users.filter((u: UserWithRole) => u.status === 'ACTIVE').length,
      inactive: users.filter((u: UserWithRole) => u.status === 'INACTIVE').length,
      suspended: users.filter((u: UserWithRole) => u.status === 'SUSPENDED').length
    };
  }, [users]);


  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole({ userId, role: newRole });
      toast.success('Rol actualizado correctamente');
      
      await fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar el rol', {
        description: error instanceof Error ? error.message : 'Por favor, intente nuevamente.'
      });
      
      throw error;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilters({ 
      ...userFilters,
      searchTerm: e.target.value || undefined,
      page: 1
    });
  };

  const handleRoleFilter = (role: string) => {
    const newFilters = { ...userFilters, page: 1 };
    if (role && role !== 'ALL') {
      newFilters.role = role as UserRole;
    } else {
      delete newFilters.role;
    }
    setUserFilters(newFilters);
  };

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...userFilters, page: 1 };
    if (status && status !== 'ALL') {
      newFilters.status = status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    } else {
      delete newFilters.status;
    }
    setUserFilters(newFilters);
  };

  const resetFilters = () => {
    setUserFilters({ page: 1 });
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Administra los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between">
              <span>Administradores:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {stats.admins}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Entrenadores:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {stats.trainers}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Miembros:</span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {stats.members}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between">
              <span>Activos:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {stats.active}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Inactivos:</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {stats.inactive}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Suspendidos:</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {stats.suspended}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Última Actualización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{new Date().toLocaleString('es-ES')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Datos de muestra generados automáticamente
            </p>
          </CardContent>
        </Card>
      </div>
      
      <UserFilters 
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onReset={resetFilters}
        filters={userFilters}
      />
      
      <UserTable 
        users={users || []}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Mostrando {Math.min((users || []).length, 10)} de {(users || []).length} usuarios</p>
      </div>
    </div>
  );
}