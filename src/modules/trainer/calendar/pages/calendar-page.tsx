import { useState, useMemo, useEffect } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';

import { WeeklyCalendar } from '../components/weekly-calendar';
import { ClassManagementModal } from '../components/class-management-modal';
import { TrainerStats } from '../components/trainer-stats';

import { useCalendarStore } from '../store/calendar-store';
import { 
  useClassesByDateRange, 
  useTrainerStats,
  useCalendarPrefetching
} from '../hooks/use-trainer-classes';

import type { CalendarEvent } from '../types';
import { convertClassesToEvents } from '../lib/calendar-utils';

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    currentDate,
    goToNext,
    goToPrevious,
    goToToday
  } = useCalendarStore();
  
  // Calcular el rango de fechas basado en currentDate usando useMemo
  const dateRange = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    console.log(`📆 dateRange calculado:`, {
      currentDate: currentDate.toISOString(),
      start: start.toISOString(),
      end: end.toISOString()
    });
    return { start, end };
  }, [currentDate]);
  
  // Log para verificar el dateRange
  useEffect(() => {
    const startDateStr = `${dateRange.start.getFullYear()}-${String(dateRange.start.getMonth() + 1).padStart(2, '0')}-${String(dateRange.start.getDate()).padStart(2, '0')}`;
    const endDateStr = `${dateRange.end.getFullYear()}-${String(dateRange.end.getMonth() + 1).padStart(2, '0')}-${String(dateRange.end.getDate()).padStart(2, '0')}`;
    
    console.log(`🗑️ Invalidando caché para rango: ${startDateStr} - ${endDateStr}`);
    console.log(`🔎 dateRange completo:`, {
      start: dateRange.start.toISOString(),
      end: dateRange.end.toISOString()
    });
    
    queryClient.invalidateQueries({ 
      queryKey: ['trainer-classes', 'by-range', startDateStr, endDateStr],
      refetchType: 'active'
    });
  }, [dateRange.start, dateRange.end, queryClient]);

  const { 
    data: classes = [], 
    isLoading: isLoadingClasses,
    error: classesError,
    refetch: refetchClasses,
    isFetching: isRefreshingClasses
  } = useClassesByDateRange(dateRange.start, dateRange.end);

  const { 
    data: stats, 
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useTrainerStats();

  const {
    prefetchNextWeek,
    prefetchPreviousWeek,
    prefetchClassDetails
  } = useCalendarPrefetching();

  const events = useMemo(() => {
    console.log(`📦 calendar-page: Recibiendo ${classes.length} clases para convertir`);
    const result = convertClassesToEvents(classes);
    console.log(`📦 calendar-page: Resultado de conversión: ${result.length} eventos`);
    return result;
  }, [classes]);
  
  // Log para ver cuando se actualiza el calendario
  useEffect(() => {
    console.log('📊 Clases en calendario:', classes);
    console.log('🎨 Eventos convertidos:', events);
  }, [classes, events]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleRefresh = async () => {
    await Promise.all([
      refetchClasses(),
      refetchStats()
    ]);
  };

  // Prefetching proactivo para las semanas anteriores y siguientes
  useEffect(() => {
    prefetchNextWeek(currentDate);
    prefetchPreviousWeek(currentDate);
  }, [currentDate, prefetchNextWeek, prefetchPreviousWeek]);

  // Prefetching de detalles de clases cuando se cargan los eventos
  useEffect(() => {
    events.forEach(event => {
      prefetchClassDetails(event.id);
    });
  }, [events, prefetchClassDetails]);

  // Debug: Logs para verificar qué está pasando
  useEffect(() => {
    console.log('📅 Rango de fechas del calendario:', {
      start: dateRange.start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      end: dateRange.end.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      currentDate: currentDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    });
    console.log('📊 Total de clases recibidas:', classes.length);
    console.log('📝 Detalles de clases:', classes.map(c => ({
      name: c.name,
      fecha: c.classDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })));
    console.log('🎯 Total de eventos convertidos:', events.length);
    console.log('📅 Detalles de eventos:', events.map(e => ({
      title: e.title,
      fecha: e.start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })));
  }, [dateRange, currentDate, classes.length, events.length]);

  if (isLoadingClasses && !classes.length) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Mi Calendario</h1>
        </div>
        
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
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Mi Calendario</h1>
      </div>

      {/* Estadísticas del trainer */}
      <TrainerStats 
        stats={stats} 
        isLoading={isLoadingStats}
      />

      {/* Calendario */}
      <Card className="mt-8">
        <CardHeader className="pb-4">
          <CardTitle>Horario Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyCalendar
            events={events}
            currentDate={currentDate}
            onEventClick={handleEventClick}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshingClasses}
            onNextWeek={goToNext}
            onPreviousWeek={goToPrevious}
            onToday={goToToday}
            className="h-[600px]"
          />
        </CardContent>
      </Card>

      {/* Modal de gestión de clases */}
      <ClassManagementModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefreshClasses={refetchClasses}
      />
    </div>
  );
}
