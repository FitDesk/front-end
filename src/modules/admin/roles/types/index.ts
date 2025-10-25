export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';



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

