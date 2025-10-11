import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  ProgressData,
  UpdateGoalsDTO,
  ApiResponse,
  HistoryFilters,
  PaginatedResponse,
  ClassHistory,
} from '../types';

const ENDPOINTS = {
  PROGRESS: '/progress',
  UPDATE_GOALS: '/goals',
  HISTORY: '/history',
};

export class HistoryService {
  
  static async getProgressData(): Promise<ProgressData> {
    try {
      const response = await fitdeskApi.get<ProgressData>(ENDPOINTS.PROGRESS);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  }

  static async updateGoals(goals: UpdateGoalsDTO): Promise<ApiResponse<UpdateGoalsDTO>> {
    try {
      const response = await fitdeskApi.put<ApiResponse<UpdateGoalsDTO>>(ENDPOINTS.UPDATE_GOALS, goals);
      return response.data;
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  }

  static async getClassHistory(
    filters?: HistoryFilters
  ): Promise<PaginatedResponse<ClassHistory>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append('status', filters.status);
      }
      
      if (filters?.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      
      if (filters?.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      
      if (filters?.searchTerm) {
        params.append('searchTerm', filters.searchTerm);
      }
      
      if (filters?.page) {
        params.append('page', filters.page.toString());
      }
      
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      
      const response = await fitdeskApi.get<PaginatedResponse<ClassHistory>>(
        `${ENDPOINTS.HISTORY}?${params.toString()}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching class history:', error);
      throw error;
    }
  }
}
