import axios from 'axios';
import type { Trainer, TrainerFormData } from '../types';

const API_URL = '/api/trainers';

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
    const response = await axios.get(API_URL, {
      params: {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10,
      },
    });
    return response.data;
  },


  async getById(id: string): Promise<Trainer> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  
  async create(trainer: FormData): Promise<Trainer> {
    const response = await axios.post(API_URL, trainer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  
  async update(id: string, trainer: Partial<TrainerFormData> | FormData): Promise<Trainer> {
    const isFormData = trainer instanceof FormData;
    
    const response = await axios.patch(
      `${API_URL}/${id}`,
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
    await axios.delete(`${API_URL}/${id}`);
  },

 
  async uploadFile(file: File, type: 'profile' | 'certification' = 'profile'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
