import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent } from '@/shared/components/animated/dialog';

const showToast = {
  success: (data: { title: string; description: string }) => {
    console.log(`[SUCCESS] ${data.title}: ${data.description}`);
  },
  error: (data: { title: string; description: string }) => {
    console.error(`[ERROR] ${data.title}: ${data.description}`);
  }
} as const;

import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from '../hooks/use-classes';
import type { CalendarEvent } from '../components/weekly-calendar';
import { WeeklyCalendar } from '../components/weekly-calendar';
import { ClassForm } from '../components/class-form';
import { ClassDetailModal } from '../components/class-detail-modal';

import type { Class, ClassRequest } from '../types/class';

export default function ClassesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  const { data: classes = [], isLoading } = useClasses();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();
  
  const events = useMemo<CalendarEvent[]>(() => {
    return classes.map(cls => ({
      id: cls.id || '',
      title: cls.className || 'Clase sin nombre',
      start: new Date(cls.classDate || new Date()),
      end: new Date(new Date(cls.classDate || new Date()).getTime() + (cls.duration || 60) * 60000),
      location: cls.locationName || 'Sala no especificada',
      capacity: cls.maxCapacity || 0,
      trainer: cls.trainerName || 'Entrenador no asignado'
    }));
  }, [classes]);

  const handleNewClass = useCallback(() => {
    setSelectedClass(null);
    setIsFormOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    const originalClass = classes.find(c => c.id === event.id);
    if (originalClass) {
      setSelectedClass(originalClass);
      setIsDetailModalOpen(true);
    }
  }, [classes]);

  const handleEditFromDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleDeleteFromDetail = useCallback(async () => {
    if (!selectedClass?.id) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      try {
        await deleteClassMutation.mutateAsync(selectedClass.id);
        showToast.success({
          title: 'Clase eliminada',
          description: 'La clase ha sido eliminada correctamente',
        });
        setIsDetailModalOpen(false);
        setSelectedClass(null);
      } catch (error) {
        showToast.error({
          title: 'Error',
          description: 'No se pudo eliminar la clase',
        });
      }
    }
  }, [selectedClass, deleteClassMutation]);

  const handleSubmit = async (formData: ClassRequest) => {
    try {
      if (selectedClass?.id) {
        await updateClassMutation.mutateAsync({
          id: selectedClass.id,
          data: formData
        });
        showToast.success({
          title: 'Clase actualizada',
          description: 'La clase ha sido actualizada correctamente',
        });
      } else {
        await createClassMutation.mutateAsync(formData);
        showToast.success({
          title: 'Clase creada',
          description: 'La clase ha sido creada correctamente',
        });
      }
      setIsFormOpen(false);
      setSelectedClass(null);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error saving class:', error);
      showToast.error({
        title: 'Error',
        description: 'No se pudo guardar la clase',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendario de Clases</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Horario Semanal</CardTitle>
            <Button onClick={handleNewClass}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Clase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <WeeklyCalendar
            events={events}
            onEventClick={handleEventClick}
            onNewEvent={handleNewClass}
            className="h-[600px]"
          />
        </CardContent>
      </Card>

      {/* Modal de detalles de la clase */}
      <ClassDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        isDeleting={deleteClassMutation.isPending}
      />

      {/* Modal de formulario de clase */}
      {isFormOpen && (
        <Dialog 
          open={isFormOpen} 
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) {
              setSelectedClass(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {selectedClass ? 'Editar Clase' : 'Nueva Clase'}
              </h2>
              <ClassForm
                initialData={selectedClass}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedClass(null);
                }}
                isSubmitting={createClassMutation.isPending || updateClassMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
