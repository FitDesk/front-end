import { fitdeskApi } from '@/core/api/fitdeskApi';
import type {
  TrainerConfiguration,
  TrainerPersonalData,
  SecuritySession,
  RecentEmail,
  SecurityCheckResponse,
  NotificationSettings,
  AccessibilitySettings,
  PrivacySettings,
  LanguageRegion,
  ChangePasswordDTO,
  DeactivateAccountDTO,
  DeleteAccountDTO,
  ApiResponse,
} from '../types';

class ConfigurationService {
  private readonly baseUrl = '/trainer/configuration';


  async getPersonalData(): Promise<TrainerPersonalData> {
    const response = await fitdeskApi.get<ApiResponse<TrainerPersonalData>>(`${this.baseUrl}/personal-data`);
    return response.data.data;
  }

  
  async deactivateAccount(data: DeactivateAccountDTO): Promise<string> {
    const response = await fitdeskApi.post<ApiResponse<null>>(`${this.baseUrl}/deactivate`, data);
    return response.data.message;
  }

  async deleteAccount(data: DeleteAccountDTO): Promise<string> {
    const response = await fitdeskApi.delete<ApiResponse<null>>(`${this.baseUrl}/delete`, { data });
    return response.data.message;
  }


  async getSecurityCheck(): Promise<SecurityCheckResponse> {
    const response = await fitdeskApi.get<ApiResponse<SecurityCheckResponse>>(`${this.baseUrl}/security-check`);
    return response.data.data;
  }

  async getActiveSessions(): Promise<SecuritySession[]> {
    const response = await fitdeskApi.get<ApiResponse<SecuritySession[]>>(`${this.baseUrl}/sessions`);
    return response.data.data;
  }

  async terminateSession(sessionId: string): Promise<string> {
    const response = await fitdeskApi.delete<ApiResponse<null>>(`${this.baseUrl}/sessions/${sessionId}`);
    return response.data.message;
  }

  async changePassword(data: ChangePasswordDTO): Promise<string> {
    const response = await fitdeskApi.post<ApiResponse<null>>(`${this.baseUrl}/change-password`, data);
    return response.data.message;
  }

  async getRecentEmails(): Promise<RecentEmail[]> {
    const response = await fitdeskApi.get<ApiResponse<RecentEmail[]>>(`${this.baseUrl}/recent-emails`);
    return response.data.data;
  }

 
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await fitdeskApi.get<ApiResponse<NotificationSettings>>(`${this.baseUrl}/notifications`);
    return response.data.data;
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<string> {
    const response = await fitdeskApi.put<ApiResponse<null>>(`${this.baseUrl}/notifications`, { settings });
    return response.data.message;
  }

  
  async getAccessibilitySettings(): Promise<AccessibilitySettings> {
    const response = await fitdeskApi.get<ApiResponse<AccessibilitySettings>>(`${this.baseUrl}/accessibility`);
    return response.data.data;
  }

  async updateAccessibilitySettings(settings: AccessibilitySettings): Promise<string> {
    const response = await fitdeskApi.put<ApiResponse<null>>(`${this.baseUrl}/accessibility`, { settings });
    return response.data.message;
  }

  
  async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await fitdeskApi.get<ApiResponse<PrivacySettings>>(`${this.baseUrl}/privacy`);
    return response.data.data;
  }

  async updatePrivacySettings(settings: PrivacySettings): Promise<string> {
    const response = await fitdeskApi.put<ApiResponse<null>>(`${this.baseUrl}/privacy`, { settings });
    return response.data.message;
  }

 
  async getLanguageRegionSettings(): Promise<LanguageRegion> {
    const response = await fitdeskApi.get<ApiResponse<LanguageRegion>>(`${this.baseUrl}/language-region`);
    return response.data.data;
  }

  async updateLanguageRegionSettings(settings: LanguageRegion): Promise<string> {
    const response = await fitdeskApi.put<ApiResponse<null>>(`${this.baseUrl}/language-region`, { settings });
    return response.data.message;
  }

 
  async getConfiguration(): Promise<TrainerConfiguration> {
    const response = await fitdeskApi.get<ApiResponse<TrainerConfiguration>>(`${this.baseUrl}`);
    return response.data.data;
  }
}

export const configurationService = new ConfigurationService();
