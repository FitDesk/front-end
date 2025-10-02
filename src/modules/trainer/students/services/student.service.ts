import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  Student,
  Class,
  PaginatedResponse,
  StudentMetrics,
  AttendanceRecord,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentStatus,
  ApiResponse
} from '../types';

const BASE_URL = '/trainer/students';

export const studentService = {
  
  async getClasses(): Promise<PaginatedResponse<Class>> {
    const { data } = await fitdeskApi.get<PaginatedResponse<Class>>(`${BASE_URL}/classes`);
    return data;
  },

  async getStudents(filters?: any, pagination?: any): Promise<PaginatedResponse<Student>> {
    const params = new URLSearchParams();
    
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.membershipType) params.append('membershipType', filters.membershipType);
    if (filters?.attendanceRate) params.append('attendanceRate', filters.attendanceRate.toString());
    
   
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
    
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(url);
    return data;
  },

  async getMetrics(): Promise<StudentMetrics> {
    const { data } = await fitdeskApi.get<StudentMetrics>(`${BASE_URL}/metrics`);
    return data;
  },

 
  async getStudentById(id: string): Promise<Student> {
    const { data } = await fitdeskApi.get<Student>(`${BASE_URL}/${id}`);
    return data;
  },

  async createStudent(studentData: CreateStudentDTO): Promise<Student> {
    const { data } = await fitdeskApi.post<Student>(`${BASE_URL}`, studentData);
    return data;
  },

  async updateStudent(id: string, studentData: UpdateStudentDTO): Promise<Student> {
    const { data } = await fitdeskApi.put<Student>(`${BASE_URL}/${id}`, studentData);
    return data;
  },

  async updateStudentStatus(id: string, status: StudentStatus): Promise<Student> {
    const { data } = await fitdeskApi.patch<Student>(`${BASE_URL}/${id}/status`, { status });
    return data;
  },

  async deleteStudent(id: string): Promise<void> {
    await fitdeskApi.delete(`${BASE_URL}/${id}`);
  },

  async getAttendanceHistory(): Promise<PaginatedResponse<AttendanceRecord>> {
    const { data } = await fitdeskApi.get<PaginatedResponse<AttendanceRecord>>(`${BASE_URL}/attendance`);
    return data;
  },

  async markAttendance(studentId: string, classId: string, status: string, notes?: string): Promise<AttendanceRecord> {
    const { data } = await fitdeskApi.post<AttendanceRecord>(`${BASE_URL}/${studentId}/attendance`, {
      classId,
      status,
      notes
    });
    return data;
  },

  async sendMessage(studentId: string, message: { subject: string; content: string; type: string }): Promise<ApiResponse<void>> {
    const { data } = await fitdeskApi.post<ApiResponse<void>>(`${BASE_URL}/${studentId}/message`, message);
    return data;
  }
};
