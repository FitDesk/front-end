import { useState, useMemo, useCallback } from 'react';
import { Plus, Clock, Users, MapPin } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const showToast = {
  success: (data: { title: string; description: string }) => {
    console.log(`[SUCCESS] ${data.title}: ${data.description}`);
  },
  error: (data: { title: string; description: string }) => {
    console.error(`[ERROR] ${data.title}: ${data.description}`);
  }
} as const;
import { useClasses } from '../hooks/use-classes';
import type { CalendarEvent } from '../components/weekly-calendar';
import { WeeklyCalendar } from '../components/weekly-calendar';
import { ClassForm } from '../components/class-form';

import type { Class, CreateClassDTO, DayOfWeek, Location } from '../types/class';

interface ClassType extends Omit<Class, 'createdAt' | 'updatedAt'> {
  id: string;
  name: string;
  trainerId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  duration: number;
  capacity: number;
  location: Location;
  description?: string;
  isActive: boolean;
}

export default function ClassesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const { data: classes = [], isLoading } = useClasses();
  
  
  const createClass = {
    mutateAsync: async (data: Omit<ClassType, 'id'>) => {
      console.log('Creating class:', data);
      
      return Promise.resolve({ ...data, id: Date.now().toString() });
    },
    isPending: false
  };
  
  const updateClass = {
    mutateAsync: async (data: ClassType) => {
      console.log('Updating class:', data);
     
      return Promise.resolve(data);
    },
    isPending: false
  };
  
 

  
  const events = useMemo<CalendarEvent[]>(() => {
    return classes.map(cls => ({
      id: cls.id || '',
      title: cls.name || 'Clase sin nombre',
      start: new Date(cls.startTime || new Date()),
      end: new Date(new Date(cls.startTime || new Date()).getTime() + (cls.duration || 60) * 60000),
      location: cls.location || 'Sala no especificada',
      capacity: cls.capacity || 0,
      trainer: cls.trainerId || 'Entrenador no asignado'
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
      const classData: ClassType = {
        id: originalClass.id || '', 
        name: originalClass.name || '',
        trainerId: originalClass.trainerId || '',
        dayOfWeek: originalClass.dayOfWeek as DayOfWeek,
        startTime: originalClass.startTime || '',
        duration: originalClass.duration || 60,
        capacity: originalClass.capacity || 0,
        location: originalClass.location as Location,
        description: originalClass.description,
        isActive: originalClass.isActive ?? true
      };
      setSelectedClass(classData);
      setIsFormOpen(true);
    }
  }, [classes]);

  const handleDelete = useCallback(async (event: CalendarEvent) => {
    if (!event.id) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      try {
        
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
  }, []);

  const handleSubmit = async (formData: CreateClassDTO) => {
    try {
      
      const classData: CreateClassDTO = {
        ...formData,
        isActive: formData.isActive ?? true
      };
      
      
      delete (classData as any).date;
      delete (classData as any).time;

      if (selectedClass?.id) {
        await updateClass.mutateAsync({
          ...classData,
          id: selectedClass.id
        });
        showToast.success({
          title: 'Clase actualizada',
          description: 'La clase ha sido actualizada correctamente',
        });
      } else {
        await createClass.mutateAsync(classData);
        showToast.success({
          title: 'Clase creada',
          description: 'La clase ha sido creada correctamente',
        });
      }
      setIsFormOpen(false);
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
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedClass ? 'Editar Clase' : 'Nueva Clase'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <ClassForm
              initialData={selectedClass || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              isSubmitting={createClass.isPending || updateClass.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
