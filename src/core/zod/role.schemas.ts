import { z } from 'zod';
import { StatusSchema, RoleTypeSchema } from './common.schemas';


export const UserWithRoleSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido').optional(),
  role: RoleTypeSchema,
  status: StatusSchema,
  profileImage: z.string().url().optional(),
  lastLogin: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  role: RoleTypeSchema.optional(),
  status: StatusSchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'role', 'lastLogin', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ===== ROLE MANAGEMENT DTOs =====

export const UpdateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: RoleTypeSchema,
  reason: z.string().min(1, 'Razón del cambio requerida'),
});

export const SendRoleChangeReminderSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().optional(),
});

export const SendPasswordResetCodeSchema = z.object({
  userId: z.string().uuid(),
});

export const ResetUserPasswordSchema = z.object({
  userId: z.string().uuid(),
  resetCode: z.string().min(6, 'Código debe tener al menos 6 caracteres'),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
});

// ===== ROLE STATISTICS =====

export const RoleStatsSchema = z.object({
  totalUsers: z.number(),
  usersByRole: z.object({
    admin: z.number(),
    trainer: z.number(),
    member: z.number(),
  }),
  usersByStatus: z.object({
    active: z.number(),
    inactive: z.number(),
    suspended: z.number(),
  }),
  recentActivity: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    action: z.string(),
    timestamp: z.string().datetime(),
  })),
});
