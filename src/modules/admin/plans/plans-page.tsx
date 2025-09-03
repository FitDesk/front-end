import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { type Plan } from './components/plans-columns';
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from './hooks/use-plans';
import { Card } from '@/shared/components/ui/card';
import { PlanModal } from './components/plan-modal';
import { PlanCard } from './components/plan-card';
import { toast } from 'sonner';

const PlansPage = () => {
  const { data: plans, isLoading, error } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPlan(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Omit<Plan, 'id'>) => {
    setIsSubmitting(true);
    try {
      if (selectedPlan) {
        await updatePlan.mutateAsync({ ...values, id: selectedPlan.id });
        toast.success('El plan se ha actualizado correctamente');
      } else {
        await createPlan.mutateAsync(values);
        toast.success('El plan se ha creado correctamente');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Ha ocurrido un error al guardar el plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      setIsDeleting(true);
      try {
        await deletePlan.mutateAsync(id);
        toast.success('El plan se ha eliminado correctamente');
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast.error('Ha ocurrido un error al eliminar el plan');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planes de Suscripción</h1>
          <p className="text-muted-foreground">Administra planes de membresía y promociones</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Crear Nuevo Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-[400px]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
          <p className="font-semibold">Error al cargar los planes</p>
          <p className="text-sm mt-1">Por favor, intenta recargar la página o contacta con soporte.</p>
          <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </pre>
        </div>
      ) : !Array.isArray(plans) ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
          <p>No se pudieron cargar los planes. La respuesta del servidor no es válida.</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No hay planes disponibles</p>
          <Button variant="outline" className="mt-4" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Crear primer plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      <PlanModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedPlan(undefined);
        }}
        plan={selectedPlan}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default PlansPage;
