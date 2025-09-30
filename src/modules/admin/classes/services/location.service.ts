import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Location, CreateLocationDTO, UpdateLocationDTO } from '../types/location';

const BASE_URL = '/api/locations';

interface LocationFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const locationService = {
  async getAll(filters: LocationFilters = {}): Promise<PaginatedResponse<Location>> {
    try {
      const response = await fitdeskApi.get<PaginatedResponse<Location>>(BASE_URL, {
        params: {
          ...filters,
          page: filters.page || 1,
          limit: filters.limit || 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }
  },

  async getById(id: string): Promise<Location | null> {
    if (!id) return null;
    try {
      const response = await fitdeskApi.get<Location>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch location ${id}:`, error);
      return null;
    }
  },

  async create(data: CreateLocationDTO): Promise<Location | null> {
    try {
      const response = await fitdeskApi.post<Location>(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create location:', error);
      return null;
    }
  },

  async update(id: string, data: UpdateLocationDTO | Partial<CreateLocationDTO>): Promise<Location | null> {
    if (!id) return null;
    try {
      const response = await fitdeskApi.put<Location>(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update location ${id}:`, error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    try {
      await fitdeskApi.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete location ${id}:`, error);
      return false;
    }
  },

  async toggleStatus(id: string, isActive: boolean): Promise<Location | null> {
    if (!id) return null;
    try {
      const response = await fitdeskApi.patch<Location>(`${BASE_URL}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Failed to toggle status for location ${id}:`, error);
      return null;
    }
  }
};
