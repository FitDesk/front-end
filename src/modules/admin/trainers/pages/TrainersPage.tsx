import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { TrainersTable } from '../components/TrainersTable';
import { PageHeader } from '@/shared/components/page-header';
import { useTrainers } from '../hooks/use-trainers';
import type { Trainer } from '../types';

export function TrainersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { trainers, isLoading, error, deleteTrainer } = useTrainers();

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

  const filteredTrainers = trainers.filter((trainer) => {
    const search = searchQuery.toLowerCase();
    return (
      trainer.firstName.toLowerCase().includes(search) ||
      trainer.lastName.toLowerCase().includes(search) ||
      trainer.documentNumber.toLowerCase().includes(search) ||
      trainer.email.toLowerCase().includes(search)
    );
  });

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <TrainersTable
          trainers={filteredTrainers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default TrainersPage;
