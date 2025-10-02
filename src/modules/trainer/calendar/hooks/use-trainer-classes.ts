import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainerClassService } from '../services/trainer-class.service';
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
    queryFn: () => TrainerClassService.getMyClasses(filters),
    staleTime: 5 * 60 * 1000, 
  });
}


export function useTrainerClass(classId: string) {
  return useQuery({
    queryKey: trainerClassKeys.detail(classId),
    queryFn: () => TrainerClassService.getClassById(classId),
    enabled: !!classId,
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
    staleTime: 10 * 60 * 1000, 
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
    queryKey: [...trainerClassKeys.byRange(startDate, endDate), filters],
    queryFn: () => TrainerClassService.getClassesByDateRange(startDate, endDate, filters),
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, 
  });
}


export function useStartClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartClassDTO) => TrainerClassService.startClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
    },
  });
}


export function useEndClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndClassDTO) => TrainerClassService.endClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.all });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceDTO) => TrainerClassService.updateAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainerClassKeys.currentSession() });
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
