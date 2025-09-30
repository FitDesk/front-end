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


const buildQueryParams = (filters: Record<string, any>, pagination: PaginationOptions): string => {
  const params = new URLSearchParams();
  
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item.toString()));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            params.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, subValue.toString());
          }
        });
      } else {
        params.append(key, value.toString());
      }
    }
  });
  

  params.append('page', pagination.page.toString());
  params.append('limit', pagination.limit.toString());
  if (pagination.sortBy) {
    params.append('sortBy', pagination.sortBy);
    params.append('sortOrder', pagination.sortOrder || 'asc');
  }
  
  return params.toString();
};

export const studentService = {

  async getClasses(
    filters: ClassFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<Class>> {
    const queryString = buildQueryParams(filters, pagination);
    const { data } = await fitdeskApi.get<PaginatedResponse<Class>>(
      `${BASE_URL}/classes?${queryString}`
    );
    return data;
  },


  async getClassStudents(
    classId: string,
    filters: StudentFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Student>> {
    const queryString = buildQueryParams(filters, pagination);
    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(
      `${BASE_URL}/classes/${classId}/students?${queryString}`
    );
    return data;
  },

  async getStudents(
    filters: StudentFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<Student>> {
    const queryString = buildQueryParams(filters, pagination);
    const { data } = await fitdeskApi.get<PaginatedResponse<Student>>(
      `${BASE_URL}?${queryString}`
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
    const queryString = buildQueryParams({ studentId, ...filters }, {
      ...pagination,
      sortBy: 'date',
      sortOrder: 'desc'
    });
    
    const { data } = await fitdeskApi.get<PaginatedResponse<AttendanceRecord>>(
      `${BASE_URL}/attendance?${queryString}`
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
    const queryString = buildQueryParams({ period, studentId }, { page: 1, limit: 1 });
    const { data } = await fitdeskApi.get(`${BASE_URL}/attendance/stats?${queryString}`);
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
