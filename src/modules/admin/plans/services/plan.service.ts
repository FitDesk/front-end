import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Plan } from '../components/plans-columns';

/**
 * Servicio para gestionar las operaciones CRUD de planes
 * Implementado como clase con métodos estáticos
 */
export class PlanService {
  private static readonly ENDPOINT = '/plans';

  /**
   * Obtiene todos los planes disponibles
   * @returns Promesa con el array de planes
   */
  static async getAll(): Promise<Plan[]> {
    try {
      const { data } = await fitdeskApi.get<Plan[]>(this.ENDPOINT);
      return this.validatePlansResponse(data);
    } catch (error) {
      console.error('Error en PlanService.getAll:', error);
      throw new Error('No se pudieron cargar los planes');
    }
  }

  /**
   * Crea un nuevo plan
   * @param plan Datos del plan a crear (sin ID)
   * @returns Promesa con el plan creado
   */
  static async create(plan: Omit<Plan, 'id'>): Promise<Plan> {
    try {
      const { data } = await fitdeskApi.post<Plan>(this.ENDPOINT, plan);
      return data;
    } catch (error) {
      console.error('Error en PlanService.create:', error);
      throw new Error('No se pudo crear el plan');
    }
  }

  /**
   * Actualiza un plan existente
   * @param plan Datos actualizados del plan
   * @returns Promesa con el plan actualizado
   */
  static async update(plan: Plan): Promise<Plan> {
    try {
      const { data } = await fitdeskApi.put<Plan>(
        `${this.ENDPOINT}/${plan.id}`, 
        plan
      );
      return data;
    } catch (error) {
      console.error('Error en PlanService.update:', error);
      throw new Error('No se pudo actualizar el plan');
    }
  }

  /**
   * Elimina un plan por su ID
   * @param id ID del plan a eliminar
   */
  static async delete(id: string): Promise<void> {
    try {
      await fitdeskApi.delete(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error en PlanService.delete:', error);
      throw new Error('No se pudo eliminar el plan');
    }
  }

  /**
   * Valida que la respuesta sea un array de planes
   * @private
   */
  private static validatePlansResponse(data: unknown): Plan[] {
    if (!Array.isArray(data)) {
      throw new Error('La respuesta no es un array de planes');
    }
    return data;
  }
}

// Exportar instancia para compatibilidad con código existente
export const planService = {
  getAll: PlanService.getAll,
  create: PlanService.create,
  update: PlanService.update,
  delete: PlanService.delete
};
