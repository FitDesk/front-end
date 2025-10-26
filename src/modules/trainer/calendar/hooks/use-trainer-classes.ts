import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerClassService } from '../services/trainer-class.service';
import { toast } from 'sonner';
import type { 
  CalendarFilters, 
  StartClassDTO, 
  EndClassDTO,
  UpdateAttendanceDTO
} from '../types';


export const trainerClassKeys = {
  all: ['trainer-classes'] as const,
  lists: () => [...trainerClassKeys.all, 'list'] as const,
  list: (filters?: CalendarFilters) => [...trainerClassKeys.lists(), filters] as const,
  details: () => [...trainerClassKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainerClassKeys.details(), id] as const,
  members: (classId: string) => [...trainerClassKeys.all, 'members', classId] as const,
  sessions: (classId: string) => [...trainerClassKeys.all, 'sessions', classId] as const,
  currentSession: () => [...trainerClassKeys.all, 'current-session'] as const,
  stats: () => [...trainerClassKeys.all, 'stats'] as const,
  byDate: (date: Date) => [...trainerClassKeys.all, 'by-date', date.toISOString().split('T')[0]] as const,
  byRange: (startDate: Date, endDate: Date) => [...trainerClassKeys.all, 'by-range', startDate.toISOString(), endDate.toISOString()] as const,
  locations: () => [...trainerClassKeys.all, 'locations'] as const,
};


export function useTrainerClasses(filters?: CalendarFilters & {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: trainerClassKeys.list(filters),
    queryFn: async () => {
      try {
        return await TrainerClassService.getMyClasses(filters);
      } catch (error) {
        console.error('Error fetching trainer classes:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}


export function useTrainerClass(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.detail(classId),
    queryFn: () => TrainerClassService.getClassById(classId),
    enabled: !!classId,
    staleTime: 30 * 1000, // Los datos son frescos por 30 segundos
    refetchOnMount: true, // Refrescar cada vez que se monta
    refetchOnWindowFocus: true, // Refrescar cuando se enfoca la ventana
    refetchInterval: 60 * 1000, // Refrescar automáticamente cada minuto
    refetchIntervalInBackground: false, // No refrescar en background
  });
}


export function useClassMembers(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.members(classId),
    queryFn: () => TrainerClassService.getClassMembers(classId),
    enabled: !!classId,
  });
}


export function useClassSessions(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.sessions(classId),
    queryFn: () => TrainerClassService.getClassSessions(classId),
    enabled: !!classId,
  });
}


export function useCurrentSession() {
  return useQuery({
    queryKey: trainerClassKeys.currentSession(),
    queryFn: () => TrainerClassService.getCurrentSession(),
    refetchInterval: 30000, 
  });
}


export function useTrainerStats() {
  return useQuery({
    queryKey: trainerClassKeys.stats(),
    queryFn: () => TrainerClassService.getTrainerStats(),
    staleTime: 5 * 60 * 1000, // Los datos son frescos por 5 minutos
    gcTime: 15 * 60 * 1000, // Cache por 15 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchInterval: 10 * 60 * 1000, // Refrescar automáticamente cada 10 minutos
    refetchIntervalInBackground: false, // No refrescar en background
  });
}


export function useClassesByDate(date: Date) {
  return useQuery({
    queryKey: trainerClassKeys.byDate(date),
    queryFn: () => TrainerClassService.getClassesByDate(date),
    enabled: !!date,
  });
}


export function useClassesByDateRange(
  startDate: Date, 
  endDate: Date, 
  filters?: CalendarFilters
) {
  return useQuery({
    queryKey: trainerClassKeys.byRange(startDate, endDate),
    queryFn: () => TrainerClassService.getClassesByDateRange(startDate, endDate, filters),
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // Los datos son frescos por 2 minutos
    gcTime: 10 * 60 * 1000, // Cache por 10 minutos
    refetchOnWindowFocus: true, // Refrescar al volver a la ventana
    refetchOnMount: false, // No refrescar en cada mount si hay datos en cache
    refetchInterval: 5 * 60 * 1000, // Refrescar automáticamente cada 5 minutos
    refetchIntervalInBackground: false, // No refrescar en background
  });
}


export function useStartClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartClassDTO) => TrainerClassService.startClass(data),
    onSuccess: () => {
      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.stats() });
      // Prefetch para la próxima vista
      queryClient.prefetchQuery({
        queryKey: trainerClassKeys.stats(),
        queryFn: () => TrainerClassService.getTrainerStats(),
      });
      toast.success('Clase iniciada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al iniciar la clase';
      toast.error(errorMessage);
    },
  });
}


export function useEndClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndClassDTO) => TrainerClassService.endClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
      toast.success('Clase finalizada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al finalizar la clase';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceDTO) => TrainerClassService.updateAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.currentSession() });
      toast.success('Asistencia actualizada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar asistencia';
      toast.error(errorMessage);
    },
  });
}


export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, memberId, status, notes }: {
      sessionId: string;
      memberId: string;
      status: 'present' | 'absent' | 'late';
      notes?: string;
    }) => TrainerClassService.markAttendance(sessionId, memberId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.currentSession() });
      toast.success('Asistencia marcada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al marcar asistencia';
      toast.error(errorMessage);
    },
  });
}


export function useCancelClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, reason }: { classId: string; reason?: string }) => 
      TrainerClassService.cancelClass(classId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
      toast.success('Clase cancelada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al cancelar la clase';
      toast.error(errorMessage);
    },
  });
}


export function useAvailableLocations() {
  return useQuery({
    queryKey: trainerClassKeys.locations(),
    queryFn: () => TrainerClassService.getAvailableLocations(),
    staleTime: 30 * 60 * 1000, 
  });
}

/**
 * Hook para prefetching proactivo de datos del calendario
 */
export function useCalendarPrefetching() {
  const queryClient = useQueryClient();

  const prefetchNextWeek = (currentDate: Date) => {
    const nextWeekStart = new Date(currentDate);
    nextWeekStart.setDate(currentDate.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(nextWeekStart, nextWeekEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(nextWeekStart, nextWeekEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchPreviousWeek = (currentDate: Date) => {
    const prevWeekStart = new Date(currentDate);
    prevWeekStart.setDate(currentDate.getDate() - 7);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekStart.getDate() + 7);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(prevWeekStart, prevWeekEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(prevWeekStart, prevWeekEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchNextMonth = (currentDate: Date) => {
    const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(nextMonthStart, nextMonthEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(nextMonthStart, nextMonthEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchPreviousMonth = (currentDate: Date) => {
    const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.byRange(prevMonthStart, prevMonthEnd),
      queryFn: () => TrainerClassService.getClassesByDateRange(prevMonthStart, prevMonthEnd),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchClassDetails = (classId: string) => {
    queryClient.prefetchQuery({
      queryKey: trainerClassKeys.detail(classId),
      queryFn: () => TrainerClassService.getClassById(classId),
      staleTime: 30 * 1000,
    });
  };

  return {
    prefetchNextWeek,
    prefetchPreviousWeek,
    prefetchNextMonth,
    prefetchPreviousMonth,
    prefetchClassDetails,
  };
}
