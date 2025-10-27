import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { useTrainerClass, useEndClass } from '../../calendar/hooks/use-trainer-classes';
import { TrainerClassService } from '../../calendar/services/trainer-class.service';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface AttendanceRecord {
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: AttendanceStatus;
  notes?: string;
}

const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Presente',
  absent: 'Ausente',
  late: 'Tarde'
};

const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  absent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  late: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
};

export default function AttendanceMainPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classIdFromCalendar, setClassIdFromCalendar] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Obtener detalles de la clase usando el hook del calendario
  const { data: classDetail, isLoading: isLoadingClass } = useTrainerClass(classIdFromCalendar || '');
  const endClassMutation = useEndClass();

  // Detectar cuando se viene desde el calendario del trainer
  useEffect(() => {
    const state = location.state as { classId?: string; autoOpen?: boolean } | null;
    
    if (state?.classId && state?.autoOpen) {
      console.log('📍 Navegando desde calendario con classId:', state.classId);
      setClassIdFromCalendar(state.classId);
      window.history.replaceState({}, '');
    }
  }, [location.state]);
  
  // Abrir el modal cuando se cargue la clase
  useEffect(() => {
    if (classDetail && classIdFromCalendar && !isModalOpen) {
      console.log('✅ Clase cargada para asistencia:', classDetail);
      console.log('👥 Estudiantes inscritos:', classDetail.enrolledMembers);
      // Inicializar records de asistencia para todos los estudiantes
      const initialRecords: Record<string, AttendanceRecord> = {};
      classDetail.enrolledMembers.forEach(member => {
        console.log('📝 Inicializando record para:', member.name, member.id);
        initialRecords[member.id] = {
          memberId: member.id,
          memberName: member.name,
          memberEmail: member.email,
          status: 'present', // Por defecto presente
        };
      });
      console.log('📋 Records de asistencia inicializados:', initialRecords);
      setAttendanceRecords(initialRecords);
      setSessionId(classDetail.id);
      setIsModalOpen(true);
    }
  }, [classDetail, classIdFromCalendar, isModalOpen]);

  const handleStatusChange = (memberId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        status
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!classDetail || !sessionId) return;

    try {
      console.log('💾 Iniciando guardado de asistencia...');
      
      // Mapear el estado de asistencia al formato del backend
      const attendanceStatusMap: Record<string, string> = {
        'present': 'PRESENTE',
        'absent': 'AUSENTE',
        'late': 'TARDE'
      };
      
      // Preparar los datos de asistencia como un objeto con memberId como key
      const attendanceData: Record<string, string> = {};
      Object.values(attendanceRecords).forEach(record => {
        attendanceData[record.memberId] = attendanceStatusMap[record.status] || 'AUSENTE';
      });

      console.log('💾 Datos de asistencia preparados:', {
        classId: sessionId,
        totalRecords: Object.keys(attendanceData).length,
        attendanceData
      });

      // Guardar SOLO la asistencia sin completar la clase
      await TrainerClassService.saveAttendance(sessionId, attendanceData);

      console.log('✅ Asistencia guardada exitosamente (clase sigue en progreso)');
      
      setIsModalOpen(false);
      setClassIdFromCalendar(null);
      // Navegar de vuelta al calendario sin recargar la página
      setTimeout(() => {
        navigate('/trainer/calendar');
      }, 6000); // Esperar 6 segundos para ver los logs
    } catch (error) {
      console.error('Error guardando asistencia:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Control de Asistencia</h1>
            <p className="text-muted-foreground">
              Gestiona la asistencia de tus clases
            </p>
          </div>
        </div>
      </div>

      {/* Información de la clase actual */}
      {isLoadingClass ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">Cargando clase...</div>
          </CardContent>
        </Card>
      ) : classDetail ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {classDetail.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{format(new Date(classDetail.classDate), 'EEEE, d MMMM yyyy', { locale: es })}</div>
                  <div className="text-xs text-muted-foreground">Fecha</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{classDetail.startTime} ({classDetail.duration} min)</div>
                  <div className="text-xs text-muted-foreground">Horario</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{classDetail.location}</div>
                  <div className="text-xs text-muted-foreground">Ubicación</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {classDetail.enrolledCount}/{classDetail.capacity} estudiantes
                </Badge>
                <Badge
                  variant={
                    classDetail.status === 'completed' ? 'default' :
                    classDetail.status === 'in_progress' ? 'secondary' :
                    classDetail.status === 'cancelled' ? 'destructive' : 'outline'
                  }
                  className="text-lg px-4 py-2"
                >
                  {classDetail.status === 'scheduled' && 'Programada'}
                  {classDetail.status === 'in_progress' && 'En Progreso'}
                  {classDetail.status === 'completed' && 'Completada'}
                  {classDetail.status === 'cancelled' && 'Cancelada'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2 text-muted-foreground">
              No hay clase seleccionada
            </h3>
            <p className="text-sm text-muted-foreground">
              Selecciona una clase desde el calendario para tomar asistencia
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Asistencia */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col min-w-[1400px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{classDetail?.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{classDetail && format(new Date(classDetail.classDate), 'EEEE, d MMMM yyyy', { locale: es })}</span>
                  <span>•</span>
                  <span>{classDetail?.startTime}</span>
                  <span>•</span>
                  <span>{classDetail?.location}</span>
                </div>
              </div>
              <Badge className="border text-sm px-3 py-1 rounded-md" variant="outline">
                {classDetail?.status === 'completed' ? 'Completada' : 
                 classDetail?.status === 'in_progress' ? 'En Progreso' : 'Programada'}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden grid grid-cols-4 gap-6 mt-4">
          {classDetail && (
            <>
              {/* Columna Izquierda - Información de la clase */}
              <Card className="col-span-1 border-2 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Total</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{classDetail.enrolledMembers.length} alumnos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Presentes</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => 
                          !attendanceRecords[m.id] || attendanceRecords[m.id]?.status === 'present'
                        ).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Ausentes</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => 
                          attendanceRecords[m.id]?.status === 'absent'
                        ).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Tarde</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classDetail.enrolledMembers.filter(m => 
                          attendanceRecords[m.id]?.status === 'late'
                        ).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Columna Derecha - Lista de estudiantes */}
              <Card className="col-span-3 flex flex-col border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Estudiantes ({classDetail.enrolledMembers.length})</span>
                    <span className="text-sm font-normal text-muted-foreground">Scroll para ver todos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-2 p-1">
                    {classDetail.enrolledMembers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay estudiantes inscritos en esta clase
                      </div>
                    ) : (
                      classDetail.enrolledMembers.map((member) => {
                      const record = attendanceRecords[member.id];
                      const status = record?.status || 'present';

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md hover:border-primary/50"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{member.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 px-3">
                                <Badge className={cn("text-xs px-2 py-1", ATTENDANCE_STATUS_COLORS[status])}>
                                  {ATTENDANCE_STATUS_LABELS[status]}
                                </Badge>
                                <MoreHorizontal className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'present')}>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Presente
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'late')}>
                                <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                Tarde
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'absent')}>
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                Ausente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          </div>

          <DialogFooter className="mt-4 pt-4 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            <Button
              onClick={handleSaveAttendance}
              disabled={endClassMutation.isPending}
              className="bg-primary hover:bg-primary/90 min-w-[150px]"
            >
              {endClassMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Asistencia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
