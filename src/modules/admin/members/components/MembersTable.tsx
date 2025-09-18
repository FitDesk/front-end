import { useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreVertical, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/core/lib/utils';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Badge } from '@/shared/components/ui/badge';

const Avatar = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-muted', className)}>
    {children}
  </div>
);

const AvatarFallback = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn('flex h-full w-full items-center justify-center', className)}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) => (
  <img src={src} alt={alt} className={cn('h-full w-full rounded-full object-cover', className)} />
);
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useMembers } from '../hooks/useMembers';
import type { Member, MemberStatus, MembershipStatus } from '../types';

interface MembersTableProps {
  onEdit?: (member: Member) => void;
  onView?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onStatusChange?: (memberId: string, status: MemberStatus) => void;
  onMembershipStatusChange?: (memberId: string, status: MembershipStatus) => void;
  showActions?: boolean;
  className?: string;
}

const statusVariant: Record<MemberStatus, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  SUSPENDED: 'secondary',
  DELETED: 'destructive',
};

const membershipStatusVariant: Record<MembershipStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  SUSPENDED: 'secondary',
  EXPIRED: 'destructive',
  CANCELLED: 'outline',
};

const statusLabels: Record<MemberStatus, string> = {
  ACTIVE: 'Activo',
  SUSPENDED: 'Suspendido',
  DELETED: 'Eliminado',
};

const membershipStatusLabels: Record<MembershipStatus, string> = {
  ACTIVE: 'Activa',
  SUSPENDED: 'Suspendida',
  EXPIRED: 'Vencida',
  CANCELLED: 'Cancelada',
};

export function MembersTable({
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  onMembershipStatusChange: _onMembershipStatusChange, 
  showActions = true,
  className = '',
}: MembersTableProps) {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const {
    members,
    isLoading,
    error,
    refreshMembers,
    pagination,
    updatePagination
  } = useMembers();

  
  const toggleRowSelection = (memberId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === members.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(members.map(member => member.id)));
    }
  };

  const handleStatusChange = (memberId: string, currentStatus: MemberStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (onStatusChange) {
      onStatusChange(memberId, newStatus);
    }
  };

  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  
  if (isLoading && members.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                {showActions && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  {showActions && (
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    );
  }

 
  if (error) {
    // Si no hay miembros, mostramos el mensaje de lista vacía
    if (error.message === 'NO_MEMBERS_FOUND' || (Array.isArray(members) && members.length === 0)) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-muted-foreground">
            <UserX className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No se encontraron miembros
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Comienza creando un nuevo miembro.
          </p>
        </div>
      );
    }
    
    // Si hay un error de conexión
    if (error.message === 'CONNECTION_ERROR') {
      return (
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-destructive">Error de conexión:</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                No se pudo conectar con el servidor
              </h3>
              <div className="mt-2 text-sm text-destructive">
                <p>Verifica tu conexión a internet e inténtalo de nuevo.</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshMembers()}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
   
    return (
      <div className="rounded-md bg-destructive/10 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-destructive">Error:</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              No se pudieron cargar los miembros
            </h3>
            <div className="mt-2 text-sm text-destructive">
              <p>{error.message}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshMembers()}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className={className}>
      {/* Acciones de selección múltiple */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-md">
          <div className="text-sm font-medium">
            {selectedRows.size} miembro(s) seleccionado(s)
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRows(new Set())}
          >
            Limpiar selección
          </Button>
        </div>
      )}

      {/* Tabla de miembros */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    members.length > 0 && selectedRows.size === members.length
                  }
                  onCheckedChange={toggleAllRows}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Membresía</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vencimiento</TableHead>
              {showActions && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.id}
                className={cn(
                  'cursor-pointer hover:bg-muted/50',
                  member.status === 'SUSPENDED' && 'opacity-70',
                  member.status === 'DELETED' && 'line-through'
                )}
                onClick={() => onView?.(member) || navigate(`/admin/members/${member.id}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.has(member.id)}
                    onCheckedChange={() => toggleRowSelection(member.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Seleccionar ${member.firstName} ${member.lastName}`}
                  />
                </TableCell>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />
                    <AvatarFallback>
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.documentNumber || 'Sin documento'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{member.phone}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {member.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={membershipStatusVariant[member.membership.status]}>
                    {membershipStatusLabels[member.membership.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[member.status]}>
                    {statusLabels[member.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.membership.endDate
                    ? formatDate(member.membership.endDate)
                    : 'Sin fecha'}
                </TableCell>
                {showActions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onView?.(member) || navigate(`/admin/members/${member.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (onEdit) {
                              onEdit(member);
                            } else {
                              navigate(`/admin/members/editar/${member.id}`, { replace: true });
                            }
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(member.id, member.status)
                          }
                        >
                          {member.status === 'ACTIVE' ? (
                            <UserX className="mr-2 h-4 w-4 text-destructive" />
                          ) : (
                            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                          )}
                          <span>
                            {member.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete?.(member)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> a{' '}
          <span className="font-medium">
            {pagination.total ? Math.min(pagination.page * pagination.limit, pagination.total) : pagination.page * pagination.limit}
          </span>
          {pagination.total && (
            <>
              {' '}de <span className="font-medium">{pagination.total}</span>
            </>
          )} miembros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePagination({ page: pagination.page - 1 })}
            disabled={pagination.page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePagination({ page: pagination.page + 1 })}
            disabled={pagination.totalPages ? pagination.page >= pagination.totalPages : false}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
