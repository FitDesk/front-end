import { fitdeskApi } from '../../../../core/api/fitdeskApi';
import type { Trainer, TrainerFormData } from '../types';


interface TrainerResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  phone: string;
  email: string;
  address: string;
  profileImageUrl?: string;
  specialties: string;
  yearsOfExperience: number;
  certifications: string[];
  availability: string[];
  hireDate: string;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'RETIRADO';
  contractType: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'INDEPENDIENTE' | 'TEMPORAL';
  salaryPerClass: number;
  bankInfo?: string;
  notes?: string;
}

function mapTrainerResponse(response: TrainerResponseDTO): Trainer {
  return {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    documentNumber: response.dni,
    birthDate: response.birthDate,
    gender: response.gender === 'MASCULINO' ? 'MALE' : response.gender === 'FEMENINO' ? 'FEMALE' : 'OTHER',
    phone: response.phone,
    email: response.email,
    address: response.address,
    profileImage: response.profileImageUrl,
    specialties: response.specialties,
    yearsOfExperience: response.yearsOfExperience,
    certifications: response.certifications.join(', '),
    certificationImages: response.certifications,
    availability: response.availability.reduce((acc, day) => {
      acc[day.toLowerCase()] = true;
      return acc;
    }, {} as Record<string, boolean>),
    joinDate: response.hireDate,
    status: response.status === 'ACTIVO' ? 'ACTIVE' : response.status === 'INACTIVO' ? 'INACTIVE' : 'SUSPENDED',
    contractType: response.contractType === 'TIEMPO_COMPLETO' ? 'FULL_TIME' : 
                  response.contractType === 'MEDIO_TIEMPO' ? 'PART_TIME' :
                  response.contractType === 'INDEPENDIENTE' ? 'FREELANCE' : 'PER_HOUR',
    salary: response.salaryPerClass,
    bankInfo: response.bankInfo,
    notes: response.notes
  };
}

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
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) {
      params.append('page', (filters.page - 1).toString()); // Backend usa 0-based indexing
    }
    if (filters.limit !== undefined) {
      params.append('size', filters.limit.toString());
    }
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }

    const response = await fitdeskApi.get(`/trainers?${params.toString()}`);
    
    // El backend ahora devuelve una respuesta paginada
    const pageData = response.data as {
      content: TrainerResponseDTO[];
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
    };
    const trainers = pageData.content.map(mapTrainerResponse);
    
    return {
      data: trainers,
      pagination: {
        page: pageData.number + 1, // Convertir de 0-based a 1-based
        limit: pageData.size,
        total: pageData.totalElements,
        totalPages: pageData.totalPages
      }
    };
  },

  async getById(id: string): Promise<Trainer> {
    const response = await fitdeskApi.get(`/trainers/${id}`);
    return mapTrainerResponse(response.data as TrainerResponseDTO);
  },

  async create(trainer: FormData): Promise<Trainer> {
    const response = await fitdeskApi.post('/trainers', trainer, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapTrainerResponse(response.data as TrainerResponseDTO);
  },

  async update(id: string, trainer: Partial<TrainerFormData> | FormData): Promise<Trainer> {
    const isFormData = trainer instanceof FormData;
    
    const response = await fitdeskApi.patch(
      `/trainers/${id}`,
      trainer,
      {
        headers: isFormData 
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      }
    );
    return mapTrainerResponse(response.data as TrainerResponseDTO);
  },

  async delete(id: string): Promise<void> {
    await fitdeskApi.delete(`/trainers/${id}`);
  },

};
