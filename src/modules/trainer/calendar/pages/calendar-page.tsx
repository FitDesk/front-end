import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { CalendarHeader } from '../components/calendar-header';
import { WeeklyCalendar } from '../components/weekly-calendar';
import { MonthlyCalendar } from '../components/monthly-calendar';
import { ClassManagementModal } from '../components/class-management-modal';
import { TrainerStats } from '../components/trainer-stats';


import { useCalendarStore } from '../store/calendar-store';
import { 
  useClassesByDateRange, 
  useTrainerStats, 
  useStartClass, 
  useEndClass, 
  useMarkAttendance,
  useAvailableLocations
} from '../hooks/use-trainer-classes';


import type { CalendarEvent, StartClassDTO, EndClassDTO, ClassAttendee } from '../types';
import { convertClassesToEvents } from '../lib/calendar-utils';

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const {
    currentDate,
    viewType,
    filters,
    dateRange,
    calendarTitle,
    setViewType,
    updateFilters,
    clearFilters,
    goToNext,
    goToPrevious,
    goToToday
  } = useCalendarStore();


  const { 
    data: classes = [], 
    isLoading: isLoadingClasses,
    error: classesError
  } = useClassesByDateRange(dateRange.start, dateRange.end);

  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useTrainerStats();

 
  const startClassMutation = useStartClass();
  const endClassMutation = useEndClass();
  const markAttendanceMutation = useMarkAttendance();

  
  const events = useMemo(() => {
    return convertClassesToEvents(classes);
  }, [classes]);

  
  const { data: availableLocations = [] } = useAvailableLocations();

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleStartClass = (event: CalendarEvent, notes?: string) => {
    const startData: StartClassDTO = {
      classId: event.id,
      sessionDate: event.start,
      notes
    };
    
    startClassMutation.mutate(startData, {
      onSuccess: () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
      }
    });
  };

  const handleEndClass = (event: CalendarEvent, attendees: ClassAttendee[], notes?: string) => {
    const endData: EndClassDTO = {
      sessionId: `session-${event.id}`,
      endTime: new Date(),
      attendees,
      notes
    };
    
    endClassMutation.mutate(endData, {
      onSuccess: () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
      }
    });
  };

  // Wrapper para el calendario semanal (solo necesita el evento)
  const handleEndClassFromCalendar = (event: CalendarEvent) => {
    handleEndClass(event, [], ''); // Sin attendees ni notas desde el calendario
  };

  const handleMarkAttendance = (
    memberId: string,
    status: 'present' | 'absent' | 'late',
    notes?: string
  ) => {
    if (!selectedEvent) return;
    
    const sessionId = `session-${selectedEvent.id}`;
    markAttendanceMutation.mutate({
      sessionId,
      memberId,
      status,
      notes
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  
  if (isLoadingClasses && !classes.length) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Mi Calendario</h1>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Calendar skeleton */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

 
  if (classesError) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Mi Calendario</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar las clases. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Mi Calendario</h1>
      </div>

      {/* Estadísticas del trainer */}
      <TrainerStats 
        stats={stats} 
        isLoading={isLoadingStats}
      />

      {/* Calendario */}
      <Card>
        <CalendarHeader
          title={calendarTitle}
          viewType={viewType}
          filters={filters}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
          onViewChange={setViewType}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          availableLocations={Array.isArray(availableLocations) ? availableLocations : []}
        />
        
        <CardContent className="p-0">
          {viewType === 'week' ? (
            <WeeklyCalendar
              events={events}
              currentDate={currentDate}
              onEventClick={handleEventClick}
              onStartClass={handleStartClass}
              onEndClass={handleEndClassFromCalendar}
              className="h-[600px]"
            />
          ) : (
            <MonthlyCalendar
              events={events}
              currentDate={currentDate}
              onEventClick={handleEventClick}
              className="h-[600px]"
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de gestión de clases */}
      <ClassManagementModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStartClass={handleStartClass}
        onEndClass={handleEndClass}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
}
