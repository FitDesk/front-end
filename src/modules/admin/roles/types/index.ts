export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  pagination: Omit<PaginationOptions, 'total' | 'totalPages'> & { total: number; totalPages: number };
  success: boolean;
  message?: string;
  error?: string;
}


export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  joinDate: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

