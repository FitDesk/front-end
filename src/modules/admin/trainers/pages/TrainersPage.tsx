import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { TrainersTable } from '../components/TrainersTable';
import { PageHeader } from '@/shared/components/page-header';
import { useTrainers } from '../hooks/use-trainers';
import type { Trainer } from '../types';


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TrainersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
 
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const filters = useMemo(() => ({
    searchTerm: debouncedSearchQuery || undefined,
    page: currentPage,
    limit: 10,
  }), [debouncedSearchQuery, currentPage]);
  
  const { trainers, pagination, isLoading, error, deleteTrainer } = useTrainers(filters);

  const handleCreate = () => {
    navigate('nuevo');
  };

  const handleEdit = (trainer: Trainer) => {
    navigate(`editar/${trainer.id}`);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTrainer(id);
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Error al cargar los entrenadores. Por favor, inténtalo de nuevo.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <PageHeader title="Gestión de Entrenadores" />
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Entrenador
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar entrenadores..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <TrainersTable
          trainers={trainers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Información de paginación */}
        {pagination && pagination.total > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} entrenadores
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainersPage;
