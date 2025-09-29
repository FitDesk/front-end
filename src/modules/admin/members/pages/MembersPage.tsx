import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useToast } from '@/shared/components/ui/toast';
import { MembersTable } from '../components/MembersTable';
import { useMembers } from '../hooks/useMembers';
import { useMemberStore } from '../store/useMemberStore';
import type { Member } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/shared/components/ui/dialog';

export function MembersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const { refreshMembers, updateFilters } = useMembers();
  const updateMemberStatus = useMemberStore(state => state.updateMemberStatus);
  const deleteMember = useMemberStore(state => state.deleteMember);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters: any = {};

      if (searchTerm.trim() !== '') {
        filters.searchTerm = searchTerm.trim();
      }

      if (statusFilter === 'inactive') {
        filters.status = ['INACTIVE'];
      } else if (statusFilter !== 'all') {
        filters.status = [statusFilter.toUpperCase()];
      }

      updateFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, updateFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMember(memberToDelete.id);
      setMemberToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMembers.size === 0) return;

    try {
      const deletePromises = Array.from(selectedMembers).map(id => deleteMember(id));
      await Promise.all(deletePromises);
      setSelectedMembers(new Set());
      toast({
        title: 'Miembros eliminados',
        description: 'Los miembros seleccionados han sido eliminados correctamente',
      });
    } catch (error) {
     
    } finally {
      setIsBulkDelete(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (memberId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED') => {
    try {
      await updateMemberStatus(memberId, status);
      
    } catch (error) {
      
    }
  };


  const confirmBulkDelete = () => {
    if (selectedMembers.size === 0) return;
    setMemberToDelete(null);
    setIsBulkDelete(true);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div className="space-y-6 mx-4 sm:mx-6 lg:mx-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Miembros</h1>
          <p className="text-muted-foreground">
            Administra los miembros de tu gimnasio y sus membresías
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => refreshMembers()}
            title="Actualizar lista de miembros"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={() => navigate('/admin/members/nuevo')}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Miembro
          </Button>
        </div>
      </div>

      {/* Filtros mejorados */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email o documento..."
              className="pl-9 w-full bg-background"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros activos */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filtros activos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 rounded-full p-0.5 hover:bg-secondary/50"
                >
                  <span className="sr-only">Eliminar filtro de búsqueda</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                Estado: {
                  statusFilter === 'active' ? 'Activos' :
                    statusFilter === 'suspended' ? 'Suspendidos' : 'Inactivos'
                }
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-1 rounded-full p-0.5 hover:bg-secondary/50"
                >
                  <span className="sr-only">Eliminar filtro de estado</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </span>
            )}
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="ml-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpiar todo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabla de miembros */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Lista de Miembros</h2>
          <div className="flex items-center space-x-2">
            {selectedMembers.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmBulkDelete}
                className="h-8"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar ({selectedMembers.size})
              </Button>
            )}
          </div>
        </div>

        <MembersTable
          onEdit={(member) => navigate(`/admin/members/editar/${member.id}`)}
          onView={(member) => navigate(`/admin/members/${member.id}`)}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isBulkDelete
                ? `¿Eliminar ${selectedMembers.size} miembros seleccionados?`
                : '¿Eliminar miembro?'}
            </DialogTitle>
            <DialogDescription>
              {isBulkDelete ? (
                'Esta acción eliminará permanentemente los miembros seleccionados y no se podrá deshacer.'
              ) : (
                <>
                  ¿Estás seguro de que deseas eliminar a{' '}
                  <span className="font-semibold">
                    {memberToDelete?.firstName} {memberToDelete?.lastName}
                  </span>
                  ? Esta acción no se puede deshacer.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                isBulkDelete ? handleBulkDelete() : handleDelete()
              }
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
