import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Location, CreateLocationDTO, UpdateLocationDTO } from '../types/location';

export function useLocations() {
  const queryClient = useQueryClient();
 
  const LOCATIONS_ENDPOINT = '/admin/locations';

 
  const { 
    data: locations = [], 
    isLoading, 
    error 
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        const response = await fitdeskApi.get<Location[]>(LOCATIONS_ENDPOINT);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    }
  });

 
  const createMutation = useMutation<Location, Error, CreateLocationDTO>({
    mutationFn: async (data: CreateLocationDTO) => {
      const response = await fitdeskApi.post<Location>(LOCATIONS_ENDPOINT, data);
      if (!response.data) {
        throw new Error('Failed to create location');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  
  const updateMutation = useMutation<Location, Error, UpdateLocationDTO>({
    mutationFn: async ({ id, ...data }: UpdateLocationDTO) => {
      const response = await fitdeskApi.put<Location>(`${LOCATIONS_ENDPOINT}/${id}`, data);
      if (!response.data) {
        throw new Error('Failed to update location');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  
  const deleteMutation = useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      await fitdeskApi.delete(`${LOCATIONS_ENDPOINT}/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  
  const toggleStatusMutation = useMutation<Location, Error, { id: string; isActive: boolean }>({
    mutationFn: async ({ id, isActive }) => {
      const response = await fitdeskApi.put<Location>(`${LOCATIONS_ENDPOINT}/${id}`, { isActive });
      if (!response.data) {
        throw new Error('Failed to update location status');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  return {
    locations,
    isLoading,
    error: error as Error | null,
    createLocation: createMutation.mutateAsync,
    updateLocation: updateMutation.mutateAsync,
    deleteLocation: deleteMutation.mutateAsync,
    toggleLocationStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
}
