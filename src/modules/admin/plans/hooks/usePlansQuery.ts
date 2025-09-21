import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planService } from '../services/plan.service';
import type { Plan, CreatePlanDto } from '../types';

interface PlanFilters {
  isActive?: boolean;
  searchTerm?: string;
  target?: 'all' | 'members' | 'trainers';
}

export const usePlans = (filters: PlanFilters = {}) => {
  return useQuery<Plan[]>({
    queryKey: ['plans', filters],
    queryFn: () => planService.getAll(),
    select: (plans) => {
    
      return plans.filter(plan => {
        if (filters.isActive !== undefined && plan.isActive !== filters.isActive) {
          return false;
        }
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          return (
            plan.name.toLowerCase().includes(searchLower) ||
            plan.description.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });
    },
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePlanDto) => planService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (plan: Plan) => planService.update(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => planService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
