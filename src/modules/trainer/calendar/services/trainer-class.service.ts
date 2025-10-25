import { fitdeskApi } from '@/core/api/fitdeskApi';
import { PaginatedApiResponseSchema } from '@/core/zod';
import { z } from 'zod';
import type { 
  TrainerClass, 
  ClassSession, 
  CalendarFilters,
  StartClassDTO,
  EndClassDTO,
  UpdateAttendanceDTO,
  ClassMember
} from '../types';

const TrainerClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dayOfWeek: z.string(),
  startTime: z.string(),
  duration: z.number(),
  capacity: z.number(),
  location: z.string(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  enrolledCount: z.number(),
  enrolledMembers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    enrolledAt: z.string().datetime(),
    attendanceStatus: z.enum(['present', 'absent', 'late']).optional(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const ClassSessionSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  sessionDate: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  attendees: z.array(z.object({
    memberId: z.string(),
    memberName: z.string(),
    status: z.enum(['present', 'absent', 'late']),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
});

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

    const response = await fitdeskApi.get(
      `${this.ENDPOINT}?${params.toString()}`
    );
    
    const validatedResponse = PaginatedApiResponseSchema(TrainerClassSchema).parse(response.data);
    
    const adaptedClasses = validatedResponse.data.map(classData => ({
      ...classData,
      dayOfWeek: classData.dayOfWeek as any,
      createdAt: new Date(classData.createdAt),
      updatedAt: new Date(classData.updatedAt),
      enrolledMembers: classData.enrolledMembers.map(member => ({
        ...member,
        enrolledAt: new Date(member.enrolledAt),
      })),
    }));
    
    return adaptedClasses;
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
      const response = await fitdeskApi.get(`${this.ENDPOINT}/current-session`);
      const validatedSession = ClassSessionSchema.parse(response.data);
      
      return {
        ...validatedSession,
        date: new Date(validatedSession.sessionDate),
        startTime: new Date(validatedSession.startTime),
        endTime: validatedSession.endTime ? new Date(validatedSession.endTime) : undefined,
        attendees: validatedSession.attendees.map(attendee => ({
          ...attendee,
          checkInTime: undefined,
        })),
      };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null; 
        }
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
    const response = await fitdeskApi.get<{
      totalClasses: number;
      completedClasses: number;
      totalStudents: number;
      averageAttendance: number;
      upcomingClasses: number;
    }>(`${this.ENDPOINT}/stats`);
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
