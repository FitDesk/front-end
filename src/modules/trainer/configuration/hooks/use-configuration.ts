import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { configurationService } from '../services/configuration.service';
import type {
  ChangePasswordDTO,
  DeactivateAccountDTO,
  DeleteAccountDTO,
  NotificationSettings,
  AccessibilitySettings,
  PrivacySettings,
  LanguageRegion,
} from '../types';


export const configurationKeys = {
  all: ['trainer-configuration'] as const,
  personalData: () => [...configurationKeys.all, 'personal-data'] as const,
  securityCheck: () => [...configurationKeys.all, 'security-check'] as const,
  sessions: () => [...configurationKeys.all, 'sessions'] as const,
  recentEmails: () => [...configurationKeys.all, 'recent-emails'] as const,
  notifications: () => [...configurationKeys.all, 'notifications'] as const,
  accessibility: () => [...configurationKeys.all, 'accessibility'] as const,
  privacy: () => [...configurationKeys.all, 'privacy'] as const,
  languageRegion: () => [...configurationKeys.all, 'language-region'] as const,
  configuration: () => [...configurationKeys.all, 'complete'] as const,
};


export const usePersonalData = () => {
  return useQuery({
    queryKey: configurationKeys.personalData(),
    queryFn: () => configurationService.getPersonalData(),
    staleTime: 5 * 60 * 1000, 
  });
};


export const useSecurityCheck = () => {
  return useQuery({
    queryKey: configurationKeys.securityCheck(),
    queryFn: () => configurationService.getSecurityCheck(),
    staleTime: 2 * 60 * 1000, 
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: configurationKeys.sessions(),
    queryFn: () => configurationService.getActiveSessions(),
    staleTime: 1 * 60 * 1000, 
  });
};

export const useRecentEmails = () => {
  return useQuery({
    queryKey: configurationKeys.recentEmails(),
    queryFn: () => configurationService.getRecentEmails(),
    staleTime: 2 * 60 * 1000, 
  });
};


export const useNotificationSettings = () => {
  return useQuery({
    queryKey: configurationKeys.notifications(),
    queryFn: () => configurationService.getNotificationSettings(),
    staleTime: 10 * 60 * 1000, 
  });
};

export const useAccessibilitySettings = () => {
  return useQuery({
    queryKey: configurationKeys.accessibility(),
    queryFn: () => configurationService.getAccessibilitySettings(),
    staleTime: 10 * 60 * 1000, 
  });
};

export const usePrivacySettings = () => {
  return useQuery({
    queryKey: configurationKeys.privacy(),
    queryFn: () => configurationService.getPrivacySettings(),
    staleTime: 10 * 60 * 1000, 
  });
};

export const useLanguageRegionSettings = () => {
  return useQuery({
    queryKey: configurationKeys.languageRegion(),
    queryFn: () => configurationService.getLanguageRegionSettings(),
    staleTime: 10 * 60 * 1000, 
  });
};

export const useConfiguration = () => {
  return useQuery({
    queryKey: configurationKeys.configuration(),
    queryFn: () => configurationService.getConfiguration(),
    staleTime: 5 * 60 * 1000, 
  });
};


export const useChangePassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ChangePasswordDTO) => configurationService.changePassword(data),
    onSuccess: (message) => {
      toast.success(message || 'Contraseña cambiada correctamente');
      queryClient.invalidateQueries({ queryKey: configurationKeys.securityCheck() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al cambiar contraseña';
      toast.error(errorMessage);
    },
  });
};

export const useDeactivateAccount = () => {
  return useMutation({
    mutationFn: (data: DeactivateAccountDTO) => configurationService.deactivateAccount(data),
    onSuccess: (message) => {
      toast.success(message || 'Cuenta desactivada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al desactivar cuenta';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (data: DeleteAccountDTO) => configurationService.deleteAccount(data),
    onSuccess: (message) => {
      toast.success(message || 'Cuenta eliminada correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al eliminar cuenta';
      toast.error(errorMessage);
    },
  });
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => configurationService.terminateSession(sessionId),
    onSuccess: (message) => {
      toast.success(message || 'Sesión terminada correctamente');
      queryClient.invalidateQueries({ queryKey: configurationKeys.sessions() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al terminar sesión';
      toast.error(errorMessage);
    },
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: NotificationSettings) => configurationService.updateNotificationSettings(settings),
    onSuccess: (message) => {
      toast.success(message || 'Configuración de notificaciones actualizada');
      queryClient.invalidateQueries({ queryKey: configurationKeys.notifications() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar notificaciones';
      toast.error(errorMessage);
    },
  });
};

export const useUpdateAccessibilitySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: AccessibilitySettings) => configurationService.updateAccessibilitySettings(settings),
    onSuccess: (message) => {
      toast.success(message || 'Configuración de accesibilidad actualizada');
      queryClient.invalidateQueries({ queryKey: configurationKeys.accessibility() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar accesibilidad';
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: PrivacySettings) => configurationService.updatePrivacySettings(settings),
    onSuccess: (message) => {
      toast.success(message || 'Configuración de privacidad actualizada');
      queryClient.invalidateQueries({ queryKey: configurationKeys.privacy() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar privacidad';
      toast.error(errorMessage);
    },
  });
};

export const useUpdateLanguageRegionSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: LanguageRegion) => configurationService.updateLanguageRegionSettings(settings),
    onSuccess: (message) => {
      toast.success(message || 'Configuración de idioma y región actualizada');
      queryClient.invalidateQueries({ queryKey: configurationKeys.languageRegion() });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any)?.response?.data?.message 
        : 'Error al actualizar idioma y región';
      toast.error(errorMessage);
    },
  });
};
