import { z } from 'zod';
import { PasswordSchema, RoleTypeSchema } from './common.schemas';

// ===== AUTHENTICATION SCHEMAS =====

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: PasswordSchema,
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token de verificación requerido'),
});

export const ResendVerificationSchema = z.object({
  email: z.string().email('Email inválido'),
});


export const EnableTwoFactorSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida para habilitar 2FA'),
});

export const VerifyTwoFactorSchema = z.object({
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

export const DisableTwoFactorSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida para deshabilitar 2FA'),
  code: z.string().length(6, 'El código debe tener 6 dígitos'),
});


export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: RoleTypeSchema,
  profileImage: z.string().url().optional(),
  emailVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  lastLogin: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
});

export const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

// ===== SESSION SCHEMAS =====

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  device: z.string(),
  browser: z.string(),
  os: z.string(),
  ipAddress: z.string(),
  location: z.string().optional(),
  isCurrentSession: z.boolean(),
  lastActivity: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const TerminateSessionSchema = z.object({
  sessionId: z.string().min(1, 'ID de sesión requerido'),
});

export const TerminateAllSessionsSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida para terminar todas las sesiones'),
});
