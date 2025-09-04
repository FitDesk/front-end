import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Plan, Promotion } from '../components/plans-columns';

// El tipo Plan ya incluye promociones

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
      // Obtener planes
      const { data: plans } = await fitdeskApi.get<Plan[]>(this.ENDPOINT);
      
      if (!plans || !Array.isArray(plans)) {
        return [];
      }
      
      try {
        // Obtener promociones activas
        const { data: promotions = [] } = await fitdeskApi.get<Promotion[]>('/promotions/active');
        
        // Asignar promociones a los planes correspondientes
        return plans.map(plan => ({
          ...plan,
          promotions: Array.isArray(promotions) ? promotions.filter(promo => 
            promo && 
            (promo.target === 'all' || 
            (promo.target === 'members' && plan.name.toLowerCase().includes('miembro')) ||
            (promo.target === 'trainers' && plan.name.toLowerCase().includes('entrenador')))
          ) : []
        }));
      } catch (promoError) {
        console.error('Error cargando promociones:', promoError);
        // Si falla cargar promociones, devolver planes sin promociones
        return plans.map(plan => ({
          ...plan,
          promotions: []
        }));
      }
    } catch (error) {
      console.error('Error en PlanService.getAll:', error);
      return [];
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
}

// Exportar instancia para compatibilidad con código existente
export const planService = {
  getAll: PlanService.getAll,
  create: PlanService.create,
  update: PlanService.update,
  delete: PlanService.delete
};
