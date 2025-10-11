import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HistoryService } from '../services/history.service';
import type { UpdateGoalsDTO, HistoryFilters } from '../types';


export const historyKeys = {
  all: ['client-history'] as const,
  progress: () => [...historyKeys.all, 'progress'] as const,
  history: (filters?: HistoryFilters) => [...historyKeys.all, 'history', filters] as const,
};


export function useProgress() {
  return useQuery({
    queryKey: historyKeys.progress(),
    queryFn: () => HistoryService.getProgressData(),
    staleTime: 1000 * 60 * 5, 
  });
}


export function useUpdateGoals() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (goals: UpdateGoalsDTO) => HistoryService.updateGoals(goals),
    onSuccess: (response) => {
    
      queryClient.invalidateQueries({ queryKey: historyKeys.progress() });
      
      toast.success(response.message || 'Objetivos actualizados correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar objetivos');
    },
  });
}


export function useClassHistory(filters?: HistoryFilters) {
  return useQuery({
    queryKey: historyKeys.history(filters),
    queryFn: () => HistoryService.getClassHistory(filters),
    staleTime: 1000 * 60 * 2, 
  });
}
