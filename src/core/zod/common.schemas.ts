import { z } from 'zod';

// ===== COMMON SCHEMAS =====

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  totalPages: z.number().min(0),
});

// Sort Schema
export const SortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Date Range Schema
export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Search Filters Schema
export const SearchFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
}).merge(SortSchema).merge(PaginationSchema);

// File Upload Schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
});

// Contact Info Schema
export const ContactInfoSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
  address: z.string().min(1, 'Dirección requerida'),
});

// Status Schema
export const StatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

// Gender Schema
export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);

// Currency Schema
export const CurrencySchema = z.enum(['PEN', 'USD', 'COP']);

// Language Schema
export const LanguageSchema = z.enum(['ES', 'EN']);

// Time Format Schema
export const TimeFormatSchema = z.enum(['12H', '24H']);

// Date Format Schema
export const DateFormatSchema = z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']);

// Theme Schema
export const ThemeSchema = z.enum(['LIGHT', 'DARK', 'SYSTEM']);

// Font Size Schema
export const FontSizeSchema = z.enum(['SMALL', 'MEDIUM', 'LARGE']);

// Contract Type Schema
export const ContractTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'HOURLY']);

// Role Type Schema (3 roles fijos)
export const RoleTypeSchema = z.enum(['ADMIN', 'TRAINER', 'MEMBER']);

// Priority Schema
export const PrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

// Notification Type Schema
export const NotificationTypeSchema = z.enum([
  'INFO', 
  'SUCCESS', 
  'WARNING', 
  'ERROR', 
  'SECURITY'
]);

// ID Schema (UUID)
export const UUIDSchema = z.string().uuid('ID inválido');

// Slug Schema
export const SlugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug inválido');

// Password Schema
export const PasswordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');

// Confirm Password Schema
export const ConfirmPasswordSchema = (passwordField: string = 'password') =>
  z.object({
    [passwordField]: PasswordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data[passwordField] === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
