import { z } from 'zod';

export const TrainerPersonalDataSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string(),
  profileImage: z.string().optional(),
  specialties: z.array(z.string()),
  experience: z.number(),
  certifications: z.string(),
  contractType: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'HOURLY']),
  salary: z.number(),
  hireDate: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export const SecuritySessionSchema = z.object({
  id: z.string(),
  device: z.string(),
  location: z.string(),
  ipAddress: z.string(),
  browser: z.string(),
  loginDate: z.string(),
  isCurrentSession: z.boolean(),
});







export const TrainerConfigurationSchema = z.object({
  personalData: TrainerPersonalDataSchema,
});


export const SecurityCheckResponseSchema = z.object({
  hasWeakPassword: z.boolean(),
  hasUnusualActivity: z.boolean(),
  hasUnverifiedDevices: z.boolean(),
  lastPasswordChange: z.string(),
  recommendedActions: z.array(z.string()),
});


export const ChangePasswordDTOSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmación de contraseña requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const DeactivateAccountDTOSchema = z.object({
  reason: z.string().min(1, 'Razón requerida'),
  feedback: z.string().optional(),
});

export const DeleteAccountDTOSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida'),
  reason: z.string().min(1, 'Razón requerida'),
  feedback: z.string().optional(),
});

// ===== API RESPONSE SCHEMAS =====
