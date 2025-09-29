import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  List,
  BarChart3,
  Download,
  Plus,
  Users,
  TrendingUp
} from 'lucide-react';
import { AttendanceCalendar } from '../components/attendance-calendar';
import { AttendanceSessionModal } from '../components/attendance-session-modal';
import { AttendanceStatsCards } from '../components/attendance-stats-cards';
import { SessionList } from '../components/session-list';
import { useAttendanceStore } from '../store/attendance-store';
import { useDaySessions } from '../hooks/use-attendance-calendar';
import { useExportAttendanceReport, useCreateAttendanceSession } from '../hooks/use-attendance';
import { toast } from 'sonner';

export default function AttendanceMainPage() {
  const {
    selectedDate,
    viewMode,
    setViewMode,
    isAttendanceModalOpen,
    setAttendanceModalOpen,
    selectedSessionId,
    setSelectedSessionId
  } = useAttendanceStore();

  const [exportLoading, setExportLoading] = useState(false);
  const exportMutation = useExportAttendanceReport();
  const createSessionMutation = useCreateAttendanceSession();

  const { dayInfo, sessions: daySessions } = useDaySessions(selectedDate);

  const handleDayClick = (date: Date) => {
    // La fecha ya se actualiza automáticamente en el store
    console.log('Día seleccionado:', format(date, 'yyyy-MM-dd'));
  };

  const handleSessionClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setAttendanceModalOpen(true);
  };

  const handleStartSession = async (_sessionId: string) => {
    // Esta funcionalidad se implementaría con el módulo de calendario
    toast.info('Funcionalidad de iniciar sesión disponible en el módulo de calendario');
  };

  const handleCompleteSession = async (_sessionId: string) => {
    // Esta funcionalidad se implementaría con el módulo de calendario
    toast.info('Funcionalidad de completar sesión disponible en el módulo de calendario');
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setExportLoading(true);
    try {
      await exportMutation.mutateAsync({ format });
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleCreateSession = async () => {
    // Modal para crear nueva sesión - se implementaría posteriormente
    toast.info('Funcionalidad de crear sesión en desarrollo');
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
              Gestiona la asistencia de tus clases y obtén estadísticas detalladas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCreateSession}
            disabled={createSessionMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sesión
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exportLoading}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Estadísticas principales */}
      <AttendanceStatsCards />

      {/* Información del día seleccionado */}
      {dayInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {dayInfo.dayDate}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {dayInfo.totalSessions} sesiones
                </Badge>
                {dayInfo.attendanceRate > 0 && (
                  <Badge variant="outline" className="text-green-600">
                    {dayInfo.attendanceRate.toFixed(0)}% asistencia
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dayInfo.scheduledSessions}</div>
                <div className="text-sm text-muted-foreground">Programadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dayInfo.inProgressSessions}</div>
                <div className="text-sm text-muted-foreground">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{dayInfo.completedSessions}</div>
                <div className="text-sm text-muted-foreground">Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dayInfo.totalPresent}</div>
                <div className="text-sm text-muted-foreground">Presentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pestañas principales */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista de Sesiones
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <AttendanceCalendar
            onDayClick={handleDayClick}
            onSessionClick={handleSessionClick}
          />

          {/* Sesiones del día seleccionado */}
          {daySessions && daySessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sesiones del {format(selectedDate, 'd MMMM yyyy', { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daySessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleSessionClick(session.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{session.className}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(session.startTime), 'HH:mm')} - {session.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {session.presentCount}/{session.totalMembers}
                        </Badge>
                        <Badge
                          variant={session.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {session.status === 'scheduled' && 'Programada'}
                          {session.status === 'in_progress' && 'En Progreso'}
                          {session.status === 'completed' && 'Completada'}
                          {session.status === 'cancelled' && 'Cancelada'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <SessionList
            onSessionClick={handleSessionClick}
            onStartSession={handleStartSession}
            onCompleteSession={handleCompleteSession}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Historial de Asistencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Historial en desarrollo</h3>
                <p>
                  Esta sección mostrará gráficos y estadísticas históricas de asistencia.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de sesión de asistencia */}
      <AttendanceSessionModal
        sessionId={selectedSessionId}
        open={isAttendanceModalOpen}
        onOpenChange={(open) => {
          setAttendanceModalOpen(open);
          if (!open) {
            setSelectedSessionId(null);
          }
        }}
      />
    </div>
  );
}
