import { useState, useMemo, useCallback } from 'react';
import { Plus, Clock, Users, MapPin } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
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

import type { Class, ClassRequest } from '../types/class';

export default function ClassesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const dayEvents = useMemo(
    () => events.filter(event => isSameDay(event.start, selectedDate)),
    [events, selectedDate]
  );

  const handleNewClass = useCallback(() => {
    setSelectedClass(null);
    setIsFormOpen(true);
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleEdit = useCallback((event: CalendarEvent) => {
    const originalClass = classes.find(c => c.id === event.id);
    if (originalClass) {
      setSelectedClass(originalClass);
      setIsFormOpen(true);
    }
  }, [classes]);

  const handleDelete = useCallback(async (event: CalendarEvent) => {
    if (!event.id) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      try {
        await deleteClassMutation.mutateAsync(event.id);
        showToast.success({
          title: 'Clase eliminada',
          description: 'La clase ha sido eliminada correctamente',
        });
      } catch (error) {
        showToast.error({
          title: 'Error',
          description: 'No se pudo eliminar la clase',
        });
      }
    }
  }, [deleteClassMutation]);

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

      <Card className="mb-6">
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
            onDateClick={handleDateClick}
            onNewEvent={handleNewClass}
            className="h-[600px]"
          />
        </CardContent>
      </Card>

      {/* Selected Day Events */}
      <Card>
        <CardHeader>
          <CardTitle>
            Clases para {format(selectedDate, 'EEEE d \'de\' MMMM', { locale: es })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay clases programadas para este día</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleNewClass}
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear nueva clase
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        Capacidad: {event.capacity} personas
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(event)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(event)}
                        disabled={deleteClassMutation.isPending}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
