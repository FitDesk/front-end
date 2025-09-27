import type { 
  UserWithRole, 
  UserFilters, 
  PaginationOptions, 
  ApiResponse
} from '../types';
import { fitdeskApi } from '@/core/api/fitdeskApi';

class RoleService {
  
  async getUsersWithRoles(filters: UserFilters = {}, pagination: Omit<PaginationOptions, 'total' | 'totalPages'> = { page: 1, limit: 10 }): Promise<ApiResponse<UserWithRole[]>> {
    try {
      const response = await fitdeskApi.get('/admin/users', {
        params: {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }
  
  async sendRoleChangeReminder(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fitdeskApi.post(`/admin/users/${userId}/send-reminder`);
      return {
        success: true,
        message: response.data.message || 'Recordatorio enviado correctamente'
      };
    } catch (error) {
      console.error('Error sending role change reminder:', error);
      throw new Error('Error al enviar el recordatorio');
    }
  }
  
  async sendPasswordResetCode(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fitdeskApi.post(`/admin/users/${userId}/send-reset-code`);
      return {
        success: true,
        message: response.data.message || 'Código de verificación enviado'
      };
    } catch (error) {
      console.error('Error sending password reset code:', error);
      throw new Error('Error al enviar el código de verificación');
    }
  }
  
  async resetPassword(data: {
    userId: string;
    currentPassword: string;
    newPassword: string;
    verificationCode: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fitdeskApi.post(`/admin/users/${data.userId}/reset-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        verificationCode: data.verificationCode
      });
      
      return {
        success: true,
        message: response.data.message || 'Contraseña actualizada correctamente'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Error al restablecer la contraseña');
    }
  }
}

export const roleService = new RoleService();
