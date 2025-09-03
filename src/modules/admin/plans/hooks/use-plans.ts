import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Plan } from '../components/plans-columns';
import { fitdeskApi } from '@/core/api/fitdeskApi';

const ENDPOINT = '/plans';

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        console.log('Fetching plans from:', ENDPOINT);
        const response = await fitdeskApi.get<Plan[]>(ENDPOINT);
        console.log('Plans API response:', response);
        
        if (!Array.isArray(response.data)) {
          console.error('Expected an array of plans but got:', response.data);
          return [];
        }
        
        return response.data;
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
    mutationFn: async (newPlan: Omit<Plan, 'id'>) => {
      const { data } = await fitdeskApi.post<Plan>(ENDPOINT, newPlan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedPlan: Plan) => {
      const { data } = await fitdeskApi.put<Plan>(`${ENDPOINT}/${updatedPlan.id}`, updatedPlan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await fitdeskApi.delete(`${ENDPOINT}/${id}`);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
