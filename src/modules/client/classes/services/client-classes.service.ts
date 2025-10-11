import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { ClientClass, ClassFilters, PaginatedResponse } from '../types';

export class ClientClassesService {

  static async getAll(filters?: ClassFilters): Promise<PaginatedResponse<ClientClass>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters?.trainerId) {
        params.append('trainerId', filters.trainerId);
      }
      
      if (filters?.location) {
        params.append('location', filters.location);
      }
      
      if (filters?.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      
      if (filters?.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      
      
      // const response = await fitdeskApi.get(`/endpoint-backend/classes?${params.toString()}`);
      const response = await fitdeskApi.get(`?${params.toString()}`);
      return response.data as PaginatedResponse<ClientClass>;
    } catch (error) {
      console.error('Error fetching client classes:', error);
      throw error;
    }
  }


  static async getById(id: string): Promise<ClientClass> {
    try {
     
      // const response = await fitdeskApi.get(`/endpoint-backend/classes/${id}`);
      const response = await fitdeskApi.get(`/${id}`);
      return response.data as ClientClass;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }


  static async confirmAttendance(classId: string): Promise<{ success: boolean; message: string }> {
    try {
     
      // const response = await fitdeskApi.post(`/endpoint-backend/classes/${classId}/confirm-attendance`);
      const response = await fitdeskApi.post(`/${classId}/confirm-attendance`);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  }


  static async cancelClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {
   
      // const response = await fitdeskApi.post(`/endpoint-backend/classes/${classId}/cancel`);
      const response = await fitdeskApi.post(`/${classId}/cancel`);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error canceling class:', error);
      throw error;
    }
  }


  static async bookClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {
 
      // const response = await fitdeskApi.post(`/endpoint-backend/classes/${classId}/book`);
      const response = await fitdeskApi.post(`/${classId}/book`);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error booking class:', error);
      throw error;
    }
  }
}
