import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { CreatePromotionDTO, Promotion, UpdatePromotionDTO } from '../types/promotion';

const ENDPOINT = '/promotions';

export class PromotionService {
  /**
   * Obtiene todas las promociones
   */
  static async getAll(): Promise<Promotion[]> {
    try {
      const { data } = await fitdeskApi.get<Promotion[]>(ENDPOINT);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      // Devolvemos un array vacío en lugar de lanzar un error
      return [];
    }
  }

  /**
   * Crea una nueva promoción
   */
  static async create(promotion: CreatePromotionDTO): Promise<Promotion> {
    try {
      const { data } = await fitdeskApi.post<Promotion>(ENDPOINT, promotion);
      return data;
    } catch (error) {
      console.error('Error al crear promoción:', error);
      throw new Error('No se pudo crear la promoción');
    }
  }

  /**
   * Actualiza una promoción existente
   */
  static async update(id: string, promotion: Omit<UpdatePromotionDTO, 'id'>): Promise<Promotion> {
    try {
      // Ensure we don't send the id in the request body
      const { id: _, ...updateData } = promotion as UpdatePromotionDTO;
      const { data } = await fitdeskApi.patch<Promotion>(`${ENDPOINT}/${id}`, updateData);
      return data;
    } catch (error) {
      console.error('Error al actualizar promoción:', error);
      throw new Error('No se pudo actualizar la promoción');
    }
  }

  /**
   * Elimina una promoción
   */
  static async delete(id: string): Promise<void> {
    try {
      await fitdeskApi.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error al eliminar promoción:', error);
      throw new Error('No se pudo eliminar la promoción');
    }
  }

  /**
   * Envía una promoción a los usuarios
   */
  static async sendPromotion(id: string): Promise<{ message: string }> {
    try {
      const { data } = await fitdeskApi.post<{ message: string }>(
        `${ENDPOINT}/${id}/send`
      );
      return data;
    } catch (error) {
      console.error('Error al enviar promoción:', error);
      throw new Error('No se pudo enviar la promoción');
    }
  }
}

// Exportar instancia para compatibilidad
export const promotionService = new PromotionService();
