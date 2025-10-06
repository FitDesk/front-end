import { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  isToday,
  getHours,
  getMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Play, Square } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import type { CalendarEvent } from '../types';
import { useStartClass, useEndClass } from '../hooks/use-trainer-classes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { CLASS_STATUS_COLORS, CLASS_STATUS_LABELS } from '../types';

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); 

export function WeeklyCalendar({
  events,
  currentDate,
  onEventClick,
  onDateClick,
  className
}: WeeklyCalendarProps) {

  const startClassMutation = useStartClass();
  const endClassMutation = useEndClass();
  
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

 
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = events.filter(event => 
        isSameDay(event.start, day)
      ).sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    
    return grouped;
  }, [events, weekDays]);

  
  const getEventPosition = (event: CalendarEvent) => {
    const startHour = getHours(event.start);
    const startMinute = getMinutes(event.start);
    const endHour = getHours(event.end);
    const endMinute = getMinutes(event.end);
    
    
    const startPositionInMinutes = (startHour - 6) * 60 + startMinute;
    const endPositionInMinutes = (endHour - 6) * 60 + endMinute;
    const durationInMinutes = endPositionInMinutes - startPositionInMinutes;
    
    
    const topPosition = startPositionInMinutes * (4 / 60); 
    const height = durationInMinutes * (4 / 60); 
    
    return {
      top: `${topPosition}rem`,
      height: `${height}rem`,
      left: '0',
      right: '0', 
      width: '100%',
      durationInMinutes 
    };
  };

  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  const handleStartClass = async (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    await startClassMutation.mutateAsync({
      classId: event.id,
      sessionDate: new Date(),
      notes: ''
    });
  };

  const handleEndClass = async (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    await endClassMutation.mutateAsync({
      sessionId: event.id,
      endTime: new Date(),
      attendees: [],
      notes: ''
    });
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header con días de la semana */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">Hora</span>
        </div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "p-4 border-r cursor-pointer hover:bg-accent/50 transition-colors",
              isToday(day) && "bg-primary/10"
            )}
            onClick={() => handleDateClick(day)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">
                {format(day, 'EEE', { locale: es })}
              </div>
              <div className={cn(
                "text-2xl font-bold mt-1",
                isToday(day) && "text-primary"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cuerpo del calendario */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 relative">
          {/* Columna de horas */}
          <div className="border-r bg-muted/30">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-xs text-muted-foreground">
                  {format(new Date().setHours(hour, 0), 'HH:mm')}
                </span>
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay[dayKey] || [];

            return (
              <div
                key={day.toISOString()}
                className="border-r relative"
                onClick={() => handleDateClick(day)}
              >
                {/* Líneas de horas */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b hover:bg-accent/20 cursor-pointer"
                  />
                ))}

                {/* Eventos del día */}
                {dayEvents.map((event) => {
                  const position = getEventPosition(event);
                  
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute cursor-pointer transition-all duration-200 z-10",
                        "border-l-4 backdrop-blur-sm",
                        event.status === 'scheduled' && "border-l-blue-500 bg-blue-500/40 hover:bg-blue-500/50",
                        event.status === 'in_progress' && "border-l-green-500 bg-green-500/40 hover:bg-green-500/50",
                        event.status === 'completed' && "border-l-gray-500 bg-gray-500/40 hover:bg-gray-500/50",
                        event.status === 'cancelled' && "border-l-red-500 bg-red-500/40 hover:bg-red-500/50"
                      )}
                      style={position}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="h-full flex flex-col justify-center p-2 overflow-hidden">
                        {/* Contenido para todos los eventos: título, ubicación y estado */}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-sm text-white truncate leading-tight flex-1 mr-2">
                              {event.title}
                            </h4>
                            <Badge 
                              className={cn(
                                "text-xs font-medium flex-shrink-0",
                                CLASS_STATUS_COLORS[event.status]
                              )}
                            >
                              {CLASS_STATUS_LABELS[event.status]}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-white/70">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            
                            {/* Iconos de acción */}
                            <div className="flex space-x-1">
                              {event.status === 'scheduled' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
                                  onClick={(e) => handleStartClass(event, e)}
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                              {event.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
                                  onClick={(e) => handleEndClass(event, e)}
                                >
                                  <Square className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
