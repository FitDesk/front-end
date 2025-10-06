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

export const RecentEmailSchema = z.object({
  id: z.string(),
  subject: z.string(),
  sender: z.string(),
  date: z.string(),
  type: z.enum(['PASSWORD_RESET', 'ACCOUNT_CHANGE', 'SECURITY_ALERT', 'NOTIFICATION']),
  read: z.boolean(),
});

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.object({
    newClasses: z.boolean(),
    classCancellations: z.boolean(),
    studentMessages: z.boolean(),
    systemUpdates: z.boolean(),
    weeklyReports: z.boolean(),
  }),
  pushNotifications: z.object({
    classReminders: z.boolean(),
    emergencyAlerts: z.boolean(),
    newMessages: z.boolean(),
  }),
  smsNotifications: z.object({
    urgentAlerts: z.boolean(),
    classChanges: z.boolean(),
  }),
});

export const AccessibilitySettingsSchema = z.object({
  theme: z.enum(['LIGHT', 'DARK', 'AUTO']),
  fontSize: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  screenReader: z.boolean(),
});

export const PrivacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'PRIVATE']),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showExperience: z.boolean(),
  allowStudentContact: z.boolean(),
});

export const LanguageRegionSchema = z.object({
  language: z.enum(['ES', 'EN']),
  region: z.string(),
  timezone: z.string(),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12H', '24H']),
  currency: z.enum(['PEN', 'USD']),
});

export const TrainerConfigurationSchema = z.object({
  personalData: TrainerPersonalDataSchema,
  notificationSettings: NotificationSettingsSchema,
  accessibilitySettings: AccessibilitySettingsSchema,
  privacySettings: PrivacySettingsSchema,
  languageRegion: LanguageRegionSchema,
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
