import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { UserRow } from './UserRow';
import type { UserWithRole } from '../types';

interface UserTableProps {
  users: UserWithRole[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: UserWithRole['role']) => Promise<void>;
}

export function UserTable({ 
  users, 
  isLoading, 
  onRoleChange
}: UserTableProps) {

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled
                />
              </TableHead>
              <TableHead className="min-w-[180px]">
                Usuario
              </TableHead>
              <TableHead className="min-w-[200px]">
                Correo
              </TableHead>
              <TableHead className="min-w-[150px]">
                Rol
              </TableHead>
              <TableHead className="min-w-[150px]">
                Último acceso
              </TableHead>
              <TableHead className="min-w-[100px] text-center">Estado</TableHead>
              <TableHead className="min-w-[120px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onRoleChange={onRoleChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}