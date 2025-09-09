import api from '../../../../lib/api';
import type { Location, CreateLocationDTO, UpdateLocationDTO } from '../types/location';

const BASE_URL = '/locations';

export const locationService = {
  async getAll(): Promise<Location[]> {
    const response = await api.get<Location[]>(BASE_URL);
    if (response.error) {
      console.error('Failed to fetch locations:', response.error);
      return [];
    }
    return response.data || [];
  },

  async getById(id: string): Promise<Location | null> {
    if (!id) return null;
    const response = await api.get<Location>(`${BASE_URL}/${id}`);
    if (response.error) {
      console.error(`Failed to fetch location ${id}:`, response.error);
      return null;
    }
    return response.data || null;
  },

  async create(data: CreateLocationDTO): Promise<Location | null> {
    const response = await api.post<Location>(BASE_URL, data);
    if (response.error) {
      console.error('Failed to create location:', response.error);
      return null;
    }
    return response.data || null;
  },

  async update(id: string, data: UpdateLocationDTO | Partial<CreateLocationDTO>): Promise<Location | null> {
    if (!id) return null;
    const response = await api.put<Location>(`${BASE_URL}/${id}`, data);
    if (response.error) {
      console.error(`Failed to update location ${id}:`, response.error);
      return null;
    }
    return response.data || null;
  },

  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const response = await api.delete(`${BASE_URL}/${id}`);
    if (response.error) {
      console.error(`Failed to delete location ${id}:`, response.error);
      return false;
    }
    return true;
  },

  async toggleStatus(id: string, isActive: boolean): Promise<Location | null> {
    if (!id) return null;
    const response = await api.put<Location>(`${BASE_URL}/${id}/status`, { isActive });
    if (response.error) {
      console.error(`Failed to toggle status for location ${id}:`, response.error);
      return null;
    }
    return response.data || null;
  }
};
