
import { useEffect, useState } from 'react';
import useRoleStore from '../store/useRoleStore';
import { toast } from 'sonner';
import type { UserRole } from '../types';
import { UserTable } from '../components/UserTable';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'motion/react';
import { Users, Shield, UserCheck } from 'lucide-react';
import { useGetUserStatistics } from '@/core/queries/useAdminUserQuery';
import { useAllMembersQuery } from '@/core/queries/useMemberQuery';


export default function UserRolesPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { data: userStats } = useGetUserStatistics();
  const { data: members } = useAllMembersQuery({});

  console.log(userStats)
  console.log(members)
  const {
    users,
    fetchUsers,
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
  }, [fetchUsers]);



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
        {/* Total Usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-1 text-3xl font-bold">
                {userStats?.totalUsers}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                Total Usuarios
              </p>
            </div>
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-purple-500/10">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Roles
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Administradores:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {userStats?.roleCounts.ADMIN || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Entrenadores:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {userStats?.roleCounts.TRAINER || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Miembros:</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {userStats?.roleCounts.USER || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3 bg-green-500/10">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Estados
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Activos:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {userStats?.activeUsers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inactivos:</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {userStats?.inactiveUsers || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Suspendidos:</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {userStats?.suspendedUsers || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>


      <UserTable
        users={members?.members || []}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
      />

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Mostrando {members?.totalElements} usuarios</p>
      </div>
    </div>
  );
}