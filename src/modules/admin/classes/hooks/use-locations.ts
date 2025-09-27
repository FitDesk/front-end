import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { CreateLocationDTO, UpdateLocationDTO } from '../types/location';

interface LocationFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useLocations(filters: LocationFilters = {}) {
  const queryClient = useQueryClient();
 
  const LOCATIONS_ENDPOINT = '/admin/locations';

 
  const { 
    data: response, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['locations', filters],
    queryFn: async () => {
      try {
        console.log('Fetching locations from API with filters:', filters);
        const response = await fitdeskApi.get(LOCATIONS_ENDPOINT, {
          params: {
            ...filters,
            page: filters.page || 1,
            limit: filters.limit || 10,
          },
        });
        console.log('API Response:', response);
        
       
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data;
        }
        
        else if (Array.isArray(response?.data)) {
          return { data: response.data, pagination: { page: 1, limit: 10, total: response.data.length, totalPages: 1 } };
        }
        
        console.warn('Unexpected API response format, returning empty response');
        return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      } catch (error) {
        console.error('Error fetching locations:', error);
        return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      }
    }
  });
  
  
  const locations = Array.isArray(response?.data) ? response.data : [];
  const pagination = response?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

 
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
    pagination,
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
