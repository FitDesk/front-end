import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { CreateLocationDTO, UpdateLocationDTO } from '../types/location';

export function useLocations() {
  const queryClient = useQueryClient();
 
  const LOCATIONS_ENDPOINT = '/admin/locations';

 
  const { 
    data: response, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        console.log('Fetching locations from API...');
        const response = await fitdeskApi.get(LOCATIONS_ENDPOINT);
        console.log('API Response:', response);
        
        // Asegurarnos de que siempre devolvemos un array
        if (Array.isArray(response?.data)) {
          return response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        
        console.warn('Unexpected API response format, returning empty array');
        return [];
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    }
  });
  
  // Aseguramos que locations siempre sea un array
  const locations = Array.isArray(response) ? response : [];

 
  const createMutation = useMutation({
    mutationFn: async (data: CreateLocationDTO) => {
      const response = await fitdeskApi.post(LOCATIONS_ENDPOINT, data);
      if (!response.data) {
        throw new Error('Failed to create location');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateLocationDTO) => {
      const response = await fitdeskApi.put(`${LOCATIONS_ENDPOINT}/${id}`, data);
      if (!response.data) {
        throw new Error('Failed to update location');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fitdeskApi.delete(`${LOCATIONS_ENDPOINT}/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fitdeskApi.put(`${LOCATIONS_ENDPOINT}/${id}`, { isActive });
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
    error,
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
