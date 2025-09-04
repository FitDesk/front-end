import { useState } from 'react';
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion, useSendPromotion } from '../hooks/use-promotions';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { PromotionsList } from '../components/promotions-list';
import { PromotionForm } from '../components/promotion-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import type { CreatePromotionDTO, UpdatePromotionDTO } from '../types/promotion';

function PromotionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<CreatePromotionDTO | UpdatePromotionDTO | undefined>(undefined);

  // Hooks para las operaciones CRUD
  const { data, isLoading, error } = usePromotions();
  
  // Aseguramos que siempre sea un array
  const promotions = Array.isArray(data) ? data : [];
  
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();
  const sendMutation = useSendPromotion();
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error al cargar las promociones: {error.message}</div>
      </div>
    );
  }

  const handleCreate = async (data: CreatePromotionDTO) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('La promoción se ha creado correctamente');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('No se pudo crear la promoción');
    }
  };

  const handleUpdate = async (data: UpdatePromotionDTO) => {
    if (!data.id) return;
    
    try {
      // Extract the id and create a new object without it for the update
      const { id, ...updateData } = data;
      await updateMutation.mutateAsync({ id, promotion: updateData });
      toast.success('La promoción se ha actualizado correctamente');
      setEditingPromotion(undefined);
    } catch (error) {
      toast.error('No se pudo actualizar la promoción');
    }
  };


  const handleSubmit = (data: CreatePromotionDTO | UpdatePromotionDTO) => {
    if ('id' in data && data.id) {
      // Create a new object to avoid mutating the original data
      const updateData = { ...data };
      handleUpdate(updateData as UpdatePromotionDTO);
    } else {
      handleCreate(data as CreatePromotionDTO);
    }
    setIsDialogOpen(false);
    setEditingPromotion(undefined);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      try {
        await deleteMutation.mutateAsync(id);
        setEditingPromotion(undefined);
        toast.success('La promoción se ha eliminado correctamente');
      } catch (error) {
        toast.error('No se pudo eliminar la promoción');
      }
    }
  };

  const handleSend = async (id: string) => {
    try {
      await sendMutation.mutateAsync(id);
      toast.success('La promoción se ha enviado a los destinatarios');
    } catch (error) {
      toast.error('No se pudo enviar la promoción');
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Promociones</h1>
          <p className="text-muted-foreground">Administra promociones y descuentos especiales para los planes</p>
        </div>
        <Button onClick={() => {
          setEditingPromotion(undefined);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Promoción
        </Button>
      </div>

      <PromotionsList
        promotions={promotions}
        onEdit={(promotion) => {
          setEditingPromotion(promotion);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
        onSend={handleSend}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingPromotion && 'id' in editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PromotionForm
              initialData={editingPromotion}
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PromotionsPage;
