export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PREMIUM';
export type ClassStatus = 'ACTIVE' | 'INACTIVE' | 'FULL';
export type ClassType = 'YOGA' | 'CROSSFIT' | 'PILATES' | 'SPINNING' | 'ZUMBA' | 'CARDIO' | 'STRENGTH';
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  status: StudentStatus;
  joinDate: string;
  lastActivity?: string;
  
  membership: {
    type: MembershipType;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  };
  
  stats: {
    totalClasses: number;
    attendedClasses: number;
    attendanceRate: number;
    currentStreak: number;
    longestStreak: number;
  };
  
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  medicalNotes?: string;
  goals?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  type: ClassType;
  description?: string;
  status: ClassStatus;
  
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    duration: number;
  }[];
  
  maxCapacity: number;
  currentEnrollment: number;
  enrolledStudents: Student[];
  
  trainer: {
    id: string;
    name: string;
  };
  
  location: string;
  room?: string;
  
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  
  stats: {
    totalSessions: number;
    averageAttendance: number;
    completionRate: number;
  };
}
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  trainer: {
    id: string;
    name: string;
  };
}

// Métricas y estadísticas
export interface StudentMetrics {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageAttendanceRate: number;
  totalClassesThisMonth: number;
  newStudentsThisMonth: number;
  
  weeklyStats: {
    week: string;
    totalClasses: number;
    averageAttendance: number;
  }[];
  
  topStudents: {
    student: Pick<Student, 'id' | 'firstName' | 'lastName' | 'profileImage'>;
    attendanceRate: number;
    totalClasses: number;
  }[];

  weeklyTrends?: {
    name: string;
    value: number;
    positive: number;
    negative: number;
  }[];
}


export interface StudentFilters {
  searchTerm?: string;
  status?: StudentStatus[];
  membershipType?: MembershipType[];
  attendanceRate?: {
    min: number;
    max: number;
  };
  joinDateRange?: {
    start: string;
    end: string;
  };
}


export interface ClassFilters {
  searchTerm?: string;
  type?: ClassType[];
  status?: ClassStatus[];
  dayOfWeek?: number[]; 
  timeRange?: {
    start: string; 
    end: string;   
  };
  capacityRange?: {
    min: number;
    max: number;
  };
}


export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'firstName' | 'lastName' | 'joinDate' | 'attendanceRate' | 'totalClasses';
  sortOrder?: 'asc' | 'desc';
}


export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  membershipEndDate: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalNotes?: string;
  goals?: string[];
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {
  status?: StudentStatus;
}


export interface StudentsState {
  
  students: Student[];
  selectedStudent: Student | null;
  metrics: StudentMetrics | null;
  attendanceHistory: AttendanceRecord[];
  
 
  filters: StudentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  viewMode: 'list' | 'grid' | 'metrics';
  selectedTab: 'students' | 'history' | 'metrics';
  
  
  setStudents: (students: Student[]) => void;
  setSelectedStudent: (student: Student | null) => void;
  setMetrics: (metrics: StudentMetrics) => void;
  setAttendanceHistory: (history: AttendanceRecord[]) => void;
  setFilters: (filters: Partial<StudentFilters>) => void;
  setPagination: (pagination: Partial<StudentsState['pagination']>) => void;
  setViewMode: (mode: StudentsState['viewMode']) => void;
  setSelectedTab: (tab: StudentsState['selectedTab']) => void;
  
 
  updateStudentStatus: (studentId: string, status: StudentStatus) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  reset: () => void;
}
