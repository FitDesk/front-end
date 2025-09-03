import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Plan } from '../components/plans-columns';
import { PlanService } from '../services/plan.service';

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        return await PlanService.getAll();
      } catch (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
    },
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
