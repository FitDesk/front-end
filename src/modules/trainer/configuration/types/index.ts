import { z } from 'zod';
import {
  TrainerPersonalDataSchema,
  SecuritySessionSchema,
  RecentEmailSchema,
  NotificationSettingsSchema,
  AccessibilitySettingsSchema,
  PrivacySettingsSchema,
  LanguageRegionSchema,
  TrainerConfigurationSchema,
} from '@/core/zod';



export type TrainerPersonalData = z.infer<typeof TrainerPersonalDataSchema>;
export type SecuritySession = z.infer<typeof SecuritySessionSchema>;
export type RecentEmail = z.infer<typeof RecentEmailSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type AccessibilitySettings = z.infer<typeof AccessibilitySettingsSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type LanguageRegion = z.infer<typeof LanguageRegionSchema>;
export type TrainerConfiguration = z.infer<typeof TrainerConfigurationSchema>;



export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeactivateAccountDTO {
  reason: string;
  feedback?: string;
}

export interface DeleteAccountDTO {
  password: string;
  reason: string;
  feedback?: string;
}

export interface UpdateNotificationSettingsDTO {
  settings: NotificationSettings;
}

export interface UpdateAccessibilitySettingsDTO {
  settings: AccessibilitySettings;
}

export interface UpdatePrivacySettingsDTO {
  settings: PrivacySettings;
}

export interface UpdateLanguageRegionDTO {
  settings: LanguageRegion;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SecurityCheckResponse {
  hasWeakPassword: boolean;
  hasUnusualActivity: boolean;
  hasUnverifiedDevices: boolean;
  lastPasswordChange: string;
  recommendedActions: string[];
}


export type ConfigurationSection = 
  | 'personal-data'
  | 'account-control' 
  | 'password-security'
  | 'accessibility'
  | 'notifications'
  | 'language-region'
  | 'profile-privacy';

export interface ConfigurationTab {
  id: ConfigurationSection;
  title: string;
  description: string;
  icon: string;
}
