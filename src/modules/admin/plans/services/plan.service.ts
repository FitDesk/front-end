import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Plan, Promotion } from '../components/plans-columns';

export class PlanService {
  private static readonly ENDPOINT = '/plans';

  /**
   * 
   * @returns 
   */
  static async getAll(): Promise<Plan[]> {
    try {
     
      const { data: plans } = await fitdeskApi.get<Plan[]>(this.ENDPOINT);
      
      if (!plans || !Array.isArray(plans)) {
        return [];
      }
      
      try {
        
        const { data: promotions = [] } = await fitdeskApi.get<Promotion[]>('/promotions/active');
        
        
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
   * 
   * @param plan 
   * @returns 
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
   * 
   * @param plan 
   * @returns 
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
   * 
   * @param id 
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


export const planService = {
  getAll: PlanService.getAll,
  create: PlanService.create,
  update: PlanService.update,
  delete: PlanService.delete
};
