import { z } from 'zod';
import { 
  StatusSchema, 
  GenderSchema
} from './common.schemas';

export const MemberSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
  dateOfBirth: z.string().datetime(),
  gender: GenderSchema,
  address: z.string().min(1, 'Dirección requerida'),
  profileImage: z.string().url().optional(),
  membershipType: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'PREMIUM']),
  membershipStartDate: z.string().datetime(),
  membershipEndDate: z.string().datetime(),
  status: StatusSchema,
  emergencyContact: z.object({
    name: z.string().min(1, 'Nombre de contacto requerido'),
    phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
    relationship: z.string().min(1, 'Relación requerida'),
  }),
  medicalConditions: z.string().optional(),
  joinDate: z.string().datetime(),
  lastActivity: z.string().datetime().optional(),
});

export const CreateMemberSchema = MemberSchema.omit({ 
  id: true, 
  joinDate: true, 
  lastActivity: true 
});

export const UpdateMemberSchema = MemberSchema.partial().extend({
  id: z.string().uuid(),
});

export const MemberFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  status: StatusSchema.optional(),
  membershipType: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'PREMIUM']).optional(),
  attendanceRate: z.object({
    min: z.number().min(0).max(100).optional(),
    max: z.number().min(0).max(100).optional(),
  }).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.enum(['firstName', 'lastName', 'joinDate', 'lastActivity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ===== ATTENDANCE SCHEMAS =====

export const AttendanceRecordSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
  classId: z.string().uuid(),
  trainerId: z.string().uuid(),
  date: z.string().datetime(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  notes: z.string().optional(),
  checkedInAt: z.string().datetime().optional(),
  checkedOutAt: z.string().datetime().optional(),
});

export const MemberMetricsSchema = z.object({
  totalMembers: z.number(),
  activeMembers: z.number(),
  newThisMonth: z.number(),
  attendanceRate: z.number(),
  membershipDistribution: z.object({
    monthly: z.number(),
    quarterly: z.number(),
    annual: z.number(),
    premium: z.number(),
  }),
  topMembers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    attendanceRate: z.number(),
    classesAttended: z.number(),
  })),
});

// ===== EXPORT RESPONSE SCHEMAS =====

export const ExportMembersSchema = z.object({
  format: z.enum(['pdf', 'excel', 'csv', 'xml']),
  filters: MemberFiltersSchema.optional(),
});
