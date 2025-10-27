import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { 
  Clock, 
  MapPin, 
  Users, 
  Play, 
  Square,
  RefreshCw
} from 'lucide-react';
import { ClassTimer } from './class-timer';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/animated/dialog';
import { cn } from '@/core/lib/utils';
import type { CalendarEvent } from '../types';
import { CLASS_STATUS_COLORS, CLASS_STATUS_LABELS } from '../types';
import { 
  useStartClass, 
  useEndClass, 
  useCancelClass,
  useTrainerClass 
} from '../hooks/use-trainer-classes';

interface ClassManagementModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshClasses?: () => void;
}

export function ClassManagementModal({
  event,
  isOpen,
  onClose,
  onRefreshClasses
}: ClassManagementModalProps) {
  const [actualClassStartTime, setActualClassStartTime] = useState<Date | null>(null);
  const [isRefreshingStudents, setIsRefreshingStudents] = useState(false);
  const navigate = useNavigate();

  // Cargar el detalle completo de la clase con los estudiantes
  const { data: classDetail, refetch: refetchClassDetail, isLoading: isLoadingClassDetail } = useTrainerClass(event?.id || '');
  
  const startClassMutation = useStartClass();
  const endClassMutation = useEndClass();
  const cancelClassMutation = useCancelClass();
  
  // Estado actualizado de la clase (usa classDetail si está disponible, sino usa event)
  const currentStatus = classDetail?.status || event?.status;
  
  // Refrescar el detalle de la clase después de iniciar/completar
  useEffect(() => {
    if (startClassMutation.isSuccess || endClassMutation.isSuccess) {
      refetchClassDetail();
      // Forzar refresh del calendario para actualizar el estado
      if (onRefreshClasses) {
        console.log('🔄 Forzando refresh del calendario...');
        setTimeout(() => {
          onRefreshClasses();
        }, 500); // Dar tiempo para que el backend actualice el estado
      }
      
      // Si se completó la clase, limpiar el localStorage del cronómetro
      if (endClassMutation.isSuccess && event?.id) {
        localStorage.removeItem(`class_timer_state_${event.id}`);
        localStorage.removeItem(`class_start_time_${event.id}`);
        console.log('🧹 Limpiando localStorage del cronómetro');
      }
    }
  }, [startClassMutation.isSuccess, endClassMutation.isSuccess, refetchClassDetail, onRefreshClasses, event?.id]);

  // Refrescar los datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && event?.id) {
      // Prefetching: cargar los datos inmediatamente
      refetchClassDetail();
      
      // Si la clase está en progreso, intentar recuperar la hora real de inicio del localStorage
      if (event.status === 'in_progress') {
        const storedStartTime = localStorage.getItem(`class_start_time_${event.id}`);
        if (storedStartTime) {
          setActualClassStartTime(new Date(storedStartTime));
        } else if (!actualClassStartTime) {
          // Si no hay hora almacenada, establecer la hora actual
          const now = new Date();
          setActualClassStartTime(now);
          localStorage.setItem(`class_start_time_${event.id}`, now.toISOString());
        }
      }
    }
  }, [isOpen, event?.id, refetchClassDetail, event?.status, actualClassStartTime]);

  // Prefetching: cargar los datos de los estudiantes cuando el modal se está preparando para abrir
  useEffect(() => {
    if (event?.id && !isOpen) {
      // Prefetching silencioso cuando el evento está disponible pero el modal no está abierto
      refetchClassDetail();
    }
  }, [event?.id, isOpen, refetchClassDetail]);

  // Prefetching adicional cuando se detecta que el modal se va a abrir
  useEffect(() => {
    if (event?.id) {
      // Prefetching inmediato cuando hay un evento seleccionado
      refetchClassDetail();
    }
  }, [event?.id, refetchClassDetail]);

  const isLoading = startClassMutation.isPending || 
                   endClassMutation.isPending || 
                   cancelClassMutation.isPending;

  
  if (!event) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clase no encontrada</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>No se pudo cargar la información de la clase.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 

 
  const handleStartClass = async () => {
    const startTime = new Date();
    setActualClassStartTime(startTime);
    localStorage.setItem(`class_start_time_${event.id}`, startTime.toISOString());
    await startClassMutation.mutateAsync({
      classId: event.id,
      sessionDate: startTime
    });
  };

  const handleEndClass = async () => {
    // Limpiar la hora de inicio del localStorage
    localStorage.removeItem(`class_start_time_${event.id}`);
    setActualClassStartTime(null);

    await endClassMutation.mutateAsync({
      sessionId: event.id, // El ID del evento es el classId
      endTime: new Date(),
      attendees: []
    });
  };

  const handleRefreshStudents = async () => {
    setIsRefreshingStudents(true);
    try {
      await refetchClassDetail();
    } finally {
      setIsRefreshingStudents(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] overflow-y-auto w-[98vw] min-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{event.title}</span>
            <Badge className={cn("ml-2 rounded-md px-3 py-1", CLASS_STATUS_COLORS[currentStatus || event.status])}>
              {CLASS_STATUS_LABELS[currentStatus || event.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna Izquierda - Información de la clase */}
          <div className="xl:col-span-1 space-y-4">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Información de la Clase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{format(event.start, 'EEEE, dd MMMM')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
                  <Users className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{event.enrolledCount}/{event.capacity} alumnos inscritos</p>
                  </div>
                </div>
                {event.description && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-sm mb-2">Descripción</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Columna Derecha - Cronómetro */}
          <div className="xl:col-span-2">
            {currentStatus === 'in_progress' && (
              <ClassTimer
                key={`timer-${event.id}-${isOpen}`}
                startTime={event.start}
                endTime={event.end}
                status={currentStatus || event.status}
                actualStartTime={actualClassStartTime || undefined}
                classId={event.id}
              />
            )}
            {currentStatus !== 'in_progress' && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  El cronómetro se mostrará cuando la clase esté en progreso
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Lista de alumnos - Ocupa todo el ancho abajo */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Alumnos Inscritos ({classDetail?.enrolledMembers?.length || event.members.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStudents}
                disabled={isRefreshingStudents}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshingStudents ? 'animate-spin' : ''}`} />
                {isRefreshingStudents ? 'Cargando...' : 'Refrescar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingClassDetail ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cargando estudiantes...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {(classDetail?.enrolledMembers || event.members).map((member, index) => (
                <div key={`member-${member.id || index}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {member.phone && (
                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                      )}
                    </div>
                  </div>

                    
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-3">
            {currentStatus === 'in_progress' && (
              <Button 
                onClick={() => {
                  // Navegar a la vista de asistencia con la clase pre-seleccionada
                  navigate('/trainer/attendance', { 
                    state: { classId: event.id, autoOpen: true }
                  });
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Tomar Asistencia
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            
            {currentStatus === 'scheduled' && (
              <Button 
                onClick={handleStartClass}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? 'Iniciando...' : 'Iniciar Clase'}
              </Button>
            )}
            
            {currentStatus === 'in_progress' && (
              <Button 
                onClick={handleEndClass}
                disabled={isLoading}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                {isLoading ? 'Terminando...' : 'Terminar Clase'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
