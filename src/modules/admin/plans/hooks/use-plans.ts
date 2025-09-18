import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Plan } from '../components/plans-columns';
import { PlanService } from '../services/plan.service';

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        const data = await PlanService.getAll();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
      }
    },
    initialData: []
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: PlanService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
mutationFn: PlanService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
mutationFn: PlanService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
