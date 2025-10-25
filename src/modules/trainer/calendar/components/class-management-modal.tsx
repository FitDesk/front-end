import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Clock, 
  MapPin, 
  Users, 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/animated/dialog';
import { cn } from '@/core/lib/utils';
import type { CalendarEvent, ClassAttendee } from '../types';
import { CLASS_STATUS_COLORS, CLASS_STATUS_LABELS } from '../types';
import { 
  useStartClass, 
  useEndClass, 
  useMarkAttendance, 
  useCancelClass 
} from '../hooks/use-trainer-classes';

interface ClassManagementModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClassManagementModal({
  event,
  isOpen,
  onClose
}: ClassManagementModalProps) {
  const [notes, setNotes] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: 'present' | 'absent' | 'late'; notes?: string }>>({});

  
  const startClassMutation = useStartClass();
  const endClassMutation = useEndClass();
  const markAttendanceMutation = useMarkAttendance();
  const cancelClassMutation = useCancelClass();

  const isLoading = startClassMutation.isPending || 
                   endClassMutation.isPending || 
                   markAttendanceMutation.isPending || 
                   cancelClassMutation.isPending;


  const attendanceStats = useMemo(() => {
    const stats = { present: 0, absent: 0, late: 0 };
    Object.values(attendanceData).forEach(({ status }) => {
      stats[status]++;
    });
    return stats;
  }, [attendanceData]);

  
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
 
  const initializeAttendance = () => {
    const initialData: Record<string, { status: 'present' | 'absent' | 'late'; notes?: string }> = {};
    event.members.forEach(member => {
      initialData[member.id] = { 
        status: member.attendanceStatus || 'present',
        notes: ''
      }
    });
    setAttendanceData(initialData);
  };

 
  const handleMarkAttendance = async (memberId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], status }
    }));
    
   
    if (event?.id) {
      await markAttendanceMutation.mutateAsync({
        sessionId: event.id,
        memberId,
        status,
        notes: attendanceData[memberId]?.notes
      });
    }
  };

 
  const handleStartClass = async () => {
    initializeAttendance();
    await startClassMutation.mutateAsync({
      classId: event.id,
      sessionDate: new Date(),
      notes
    });
  };

  const handleEndClass = async () => {
    const attendees: ClassAttendee[] = event.members.map(member => ({
      memberId: member.id,
      memberName: member.name,
      status: attendanceData[member.id]?.status || 'present',
      checkInTime: attendanceData[member.id]?.status === 'present' ? new Date() : undefined,
      notes: attendanceData[member.id]?.notes
    }));

    await endClassMutation.mutateAsync({
      sessionId: event.id,
      endTime: new Date(),
      attendees,
      notes
    });
  };

  const handleAttendanceChange = (memberId: string, status: 'present' | 'absent' | 'late') => {
    handleMarkAttendance(memberId, status);
  };


  const getAttendanceIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getAttendanceColor = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] overflow-y-auto w-[98vw] min-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{event.title}</span>
            <Badge className={cn("ml-2", CLASS_STATUS_COLORS[event.status])}>
              {CLASS_STATUS_LABELS[event.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna Izquierda - Información de la clase */}
          <div className="xl:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de la Clase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</p>
                    <p className="text-sm text-muted-foreground">{format(event.start, 'EEEE, dd MMMM')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.enrolledCount}/{event.capacity} alumnos</p>
                    <p className="text-sm text-muted-foreground">Inscritos</p>
                  </div>
                </div>
                {event.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas de asistencia (solo si la clase está en progreso o terminada) */}
            {event.status !== 'scheduled' && Object.keys(attendanceData).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas de Asistencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                      <div className="text-sm text-muted-foreground">Presentes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                      <div className="text-sm text-muted-foreground">Llegaron tarde</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                      <div className="text-sm text-muted-foreground">Ausentes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Derecha - Notas de la clase */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas de la Clase</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Agregar notas sobre la clase..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lista de alumnos - Ocupa todo el ancho abajo */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Alumnos Inscritos ({event.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {event.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
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

                    
                    {/* Controles de asistencia para clases en progreso */}
                    {event.status === 'in_progress' && (
                      <div className="flex flex-wrap gap-2">
                        {(['present', 'absent', 'late'] as const).map((status) => (
                          <Button
                            key={status}
                            variant={attendanceData[member.id]?.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendanceChange(member.id, status)}
                            className={cn(
                              "text-xs",
                              attendanceData[member.id]?.status === status && getAttendanceColor(status)
                            )}
                          >
                            {getAttendanceIcon(status)}
                            <span className="ml-1 capitalize">
                              {status === 'present' ? 'Presente' : status === 'absent' ? 'Ausente' : 'Tarde'}
                            </span>
                          </Button>
                        ))}
                      </div>
                  )}
                  
                  {/* Mostrar estado de asistencia para clases completadas */}
                  {event.status !== 'in_progress' && event.status !== 'scheduled' && member.attendanceStatus && (
                    <Badge className={cn("w-fit", getAttendanceColor(member.attendanceStatus))}>
                      {getAttendanceIcon(member.attendanceStatus)}
                      <span className="ml-1 capitalize">
                        {member.attendanceStatus === 'present' ? 'Presente' : 
                         member.attendanceStatus === 'absent' ? 'Ausente' : 'Tarde'}
                      </span>
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          
          {event.status === 'scheduled' && (
            <Button 
              onClick={handleStartClass}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Iniciando...' : 'Iniciar Clase'}
            </Button>
          )}
          
          {event.status === 'in_progress' && (
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
      </DialogContent>
    </Dialog>
  );
}
