import { fitdeskApi } from '../../../../core/api/fitdeskApi';
import type { Trainer, TrainerFormData } from '../types';

interface TrainerFilters {
  searchTerm?: string;
  status?: string;
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

export const trainerService = {
  async getAll(filters: TrainerFilters = {}): Promise<PaginatedResponse<Trainer>> {
    const response = await fitdeskApi.get('/admin/trainers', {
      params: {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10,
      },
    });
    return response.data;
  },

  async getById(id: string): Promise<Trainer> {
    const response = await fitdeskApi.get(`/admin/trainers/${id}`);
    return response.data;
  },

  async create(trainer: FormData): Promise<Trainer> {
    const response = await fitdeskApi.post('/admin/trainers', trainer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, trainer: Partial<TrainerFormData> | FormData): Promise<Trainer> {
    const isFormData = trainer instanceof FormData;
    
    const response = await fitdeskApi.patch(
      `/admin/trainers/${id}`,
      trainer,
      {
        headers: isFormData 
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await fitdeskApi.delete(`/admin/trainers/${id}`);
  },

  async uploadFile(file: File, type: 'profile' | 'certification' = 'profile'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fitdeskApi.post('/admin/trainers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
