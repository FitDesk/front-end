import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  Student,
  Class,
  StudentFilters,
  ClassFilters,
  PaginationOptions,
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
  async getClasses(
    filters: ClassFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<Class>> {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.type?.length) {
      filters.type.forEach(type => params.append('type', type));
    }
    if (filters.status?.length) {
      filters.status.forEach(status => params.append('status', status));
    }
    if (filters.dayOfWeek?.length) {
      filters.dayOfWeek.forEach(day => params.append('dayOfWeek', day.toString()));
    }
    if (filters.capacityRange) {
      params.append('capacityMin', filters.capacityRange.min.toString());
      params.append('capacityMax', filters.capacityRange.max.toString());
    }
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    const { data } = await fitdeskApi.get<PaginatedResponse<Class>>(
      `${BASE_URL}/classes?${params.toString()}`
    );
    return data;
  },

  async getClassStudents(
    classId: string,
    filters: StudentFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Student>> {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.status?.length) {
      filters.status.forEach(status => params.append('status', status));
    }
    if (filters.membershipType?.length) {
      filters.membershipType.forEach(type => params.append('membershipType', type));
    }
    if (filters.attendanceRate) {
      params.append('attendanceRateMin', filters.attendanceRate.min.toString());
      params.append('attendanceRateMax', filters.attendanceRate.max.toString());
    }
    if (filters.joinDateRange) {
      params.append('joinDateStart', filters.joinDateRange.start);
      params.append('joinDateEnd', filters.joinDateRange.end);
    }
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
      params.append('sortOrder', pagination.sortOrder || 'asc');
    }

    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(
      `${BASE_URL}/classes/${classId}/students?${params.toString()}`
    );
    return data;
  },

  async getStudents(
    filters: StudentFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<Student>> {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    if (filters.status?.length) {
      filters.status.forEach(status => params.append('status', status));
    }
    if (filters.membershipType?.length) {
      filters.membershipType.forEach(type => params.append('membershipType', type));
    }
    if (filters.attendanceRate) {
      params.append('attendanceRateMin', filters.attendanceRate.min.toString());
      params.append('attendanceRateMax', filters.attendanceRate.max.toString());
    }
    if (filters.joinDateRange) {
      params.append('joinDateStart', filters.joinDateRange.start);
      params.append('joinDateEnd', filters.joinDateRange.end);
    }
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
      params.append('sortOrder', pagination.sortOrder || 'asc');
    }

    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(
      `${BASE_URL}?${params.toString()}`
    );
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

  async getMetrics(): Promise<StudentMetrics> {
    const { data } = await fitdeskApi.get<StudentMetrics>(`${BASE_URL}/metrics`);
    return data;
  },

  async getAttendanceHistory(
    studentId?: string,
    filters: {
      startDate?: string;
      endDate?: string;
      status?: string[];
    } = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<AttendanceRecord>> {
    const params = new URLSearchParams();
    
    if (studentId) {
      params.append('studentId', studentId);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters.status?.length) {
      filters.status.forEach(status => params.append('status', status));
    }
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    params.append('sortBy', 'date');
    params.append('sortOrder', 'desc');

    const { data } = await fitdeskApi.get<PaginatedResponse<AttendanceRecord>>(
      `${BASE_URL}/attendance?${params.toString()}`
    );
    return data;
  },

  async updateAttendanceRecord(
    recordId: string,
    updateData: { status: string; notes?: string }
  ): Promise<AttendanceRecord> {
    const { data } = await fitdeskApi.patch<AttendanceRecord>(
      `${BASE_URL}/attendance/${recordId}`,
      updateData
    );
    return data;
  },

  async markAttendance(
    studentId: string,
    classId: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    notes?: string
  ): Promise<AttendanceRecord> {
    const { data } = await fitdeskApi.post<AttendanceRecord>(
      `${BASE_URL}/${studentId}/attendance`,
      { classId, status, notes }
    );
    return data;
  },


  async sendMessage(
    studentId: string,
    message: {
      subject: string;
      content: string;
      type: 'email' | 'sms' | 'notification';
    }
  ): Promise<ApiResponse<void>> {
    const { data } = await fitdeskApi.post<ApiResponse<void>>(
      `${BASE_URL}/${studentId}/message`,
      message
    );
    return data;
  },

  async getAttendanceStats(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    studentId?: string
  ): Promise<{
    period: string;
    totalClasses: number;
    attendedClasses: number;
    attendanceRate: number;
    trends: {
      date: string;
      attended: number;
      total: number;
      rate: number;
    }[];
  }> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (studentId) {
      params.append('studentId', studentId);
    }

    const { data } = await fitdeskApi.get(`${BASE_URL}/attendance/stats?${params.toString()}`);
    return data;
  },

  async renewMembership(
    studentId: string,
    membershipData: {
      type: string;
      endDate: string;
      paymentMethod?: string;
      amount?: number;
    }
  ): Promise<Student> {
    const { data } = await fitdeskApi.post<Student>(
      `${BASE_URL}/${studentId}/membership/renew`,
      membershipData
    );
    return data;
  }
};
