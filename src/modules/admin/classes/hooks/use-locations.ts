import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '../services/location.service';
import type { LocationRequest } from '../types/location';

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

  const { 
    data: response, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['locations', filters],
    queryFn: async () => {
      try {
        console.log('Fetching locations from API with filters:', filters);
        const result = await locationService.getAll(filters);
        console.log('API Response:', result);
        return result;
      } catch (error) {
        console.error('Error fetching locations:', error);
        return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      }
    }
  });
  
  const locations = Array.isArray(response?.data) ? response.data : [];
  const pagination = response?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  const createMutation = useMutation({
    mutationFn: async (data: LocationRequest) => {
      const result = await locationService.create(data);
      if (!result) {
        throw new Error('Failed to create location');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LocationRequest }) => {
      const result = await locationService.update(id, data);
      if (!result) {
        throw new Error('Failed to update location');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const success = await locationService.delete(id);
      if (!success) {
        throw new Error('Failed to delete location');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const result = await locationService.toggleStatus(id, isActive);
      if (!result) {
        throw new Error('Failed to update location status');
      }
      return result;
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
