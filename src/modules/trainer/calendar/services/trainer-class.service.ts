import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { 
  TrainerClass, 
  ClassSession, 
  CalendarFilters,
  StartClassDTO,
  EndClassDTO,
  UpdateAttendanceDTO,
  ClassMember
} from '../types';


interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TrainerClassFilters extends CalendarFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class TrainerClassService {
  private static readonly ENDPOINT = '/trainer/classes';

  /**
   * Obtiene todas las clases asignadas al trainer actual con filtros
   */
  static async getMyClasses(filters?: TrainerClassFilters): Promise<TrainerClass[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    if (filters?.location) {
      params.append('location', filters.location);
    }
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate);
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate);
    }
    
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await fitdeskApi.get<PaginatedResponse<TrainerClass>>(
      `${this.ENDPOINT}?${params.toString()}`
    );
    
    return response.data.data;
  }

  /**
   * Obtiene las clases en un rango de fechas (para calendario)
   */
  static async getClassesByDateRange(startDate: Date, endDate: Date, filters?: CalendarFilters): Promise<TrainerClass[]> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    if (filters?.location) {
      params.append('location', filters.location);
    }

    const response = await fitdeskApi.get<TrainerClass[]>(
      `${this.ENDPOINT}/date-range?${params.toString()}`
    );
    
    return response.data;
  }

  
  static async getClassById(classId: string): Promise<TrainerClass> {
    const response = await fitdeskApi.get<TrainerClass>(`${this.ENDPOINT}/${classId}`);
    return response.data;
  }

 
  static async getClassMembers(classId: string): Promise<ClassMember[]> {
    const response = await fitdeskApi.get<ClassMember[]>(`${this.ENDPOINT}/${classId}/members`);
    return response.data;
  }

 
  static async getClassSessions(classId: string): Promise<ClassSession[]> {
    const response = await fitdeskApi.get<ClassSession[]>(`${this.ENDPOINT}/${classId}/sessions`);
    return response.data;
  }

  
  static async startClass(startData: StartClassDTO): Promise<ClassSession> {
    const response = await fitdeskApi.post<ClassSession>(`${this.ENDPOINT}/start-session`, startData);
    return response.data;
  }

  
  static async endClass(endData: EndClassDTO): Promise<ClassSession> {
    const response = await fitdeskApi.patch<ClassSession>(`${this.ENDPOINT}/end-session`, endData);
    return response.data;
  }

 
  static async updateAttendance(attendanceData: UpdateAttendanceDTO): Promise<ClassSession> {
    const response = await fitdeskApi.patch<ClassSession>(`${this.ENDPOINT}/update-attendance`, attendanceData);
    return response.data;
  }

  
  static async getCurrentSession(): Promise<ClassSession | null> {
    try {
      const response = await fitdeskApi.get<ClassSession>(`${this.ENDPOINT}/current-session`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; 
      }
      throw error;
    }
  }


  static async cancelClass(classId: string, reason?: string): Promise<void> {
    await fitdeskApi.patch(`${this.ENDPOINT}/${classId}/cancel`, { reason });
  }

 
  static async getTrainerStats(): Promise<{
    totalClasses: number;
    completedClasses: number;
    totalStudents: number;
    averageAttendance: number;
    upcomingClasses: number;
  }> {
    const response = await fitdeskApi.get(`${this.ENDPOINT}/stats`);
    return response.data;
  }

 
  static async getClassesByDate(date: Date): Promise<TrainerClass[]> {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fitdeskApi.get<TrainerClass[]>(`${this.ENDPOINT}/date/${dateStr}`);
    return response.data;
  }

 
  static async markAttendance(
    sessionId: string, 
    memberId: string, 
    status: 'present' | 'absent' | 'late', 
    notes?: string
  ): Promise<void> {
    await fitdeskApi.patch(`${this.ENDPOINT}/sessions/${sessionId}/attendance`, {
      memberId,
      status,
      notes
    });
  }

  
  static async getAvailableLocations(): Promise<string[]> {
    const response = await fitdeskApi.get<string[]>(`${this.ENDPOINT}/locations`);
    return response.data;
  }
}
