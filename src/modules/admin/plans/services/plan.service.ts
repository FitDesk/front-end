/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { fitdeskApi } from "../../../../core/api/fitdeskApi";
import type {
  PlanResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
  UserMemberships,
} from "../../../../core/interfaces/plan.interface";

export class PlanService {
  static async getActivePlans(): Promise<PlanResponse[]> {
    try {
      const response = await fitdeskApi.get<PlanResponse[]>(
        `/billing/plans/active`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo planes activos:", error);
      throw new Error(error.message || "Error al obtener planes activos");
    }
  }

  static async getAllPlans(): Promise<PlanResponse[]> {
    try {
      const response = await fitdeskApi.get<PlanResponse[]>("/billing/plans");
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo todos los planes:", error);
      throw new Error(error.message || "Error al obtener los planes");
    }
  }

  static async getPlanById(id: string): Promise<PlanResponse> {
    try {
      const response = await fitdeskApi.get<PlanResponse>(
        `/billing/plans/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error obteniendo plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al obtener el plan");
    }
  }

  static async createPlan(planData: CreatePlanRequest): Promise<PlanResponse> {
    try {
      const response = await fitdeskApi.post<PlanResponse>(
        `/billing/plans`,
        planData
      );
      console.log("✅ Plan creado exitosamente:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creando plan:", error);
      throw new Error(error.message || "Error al crear el plan");
    }
  }

  static async updatePlan(
    id: string,
    planData: UpdatePlanRequest
  ): Promise<PlanResponse> {
    try {
      const response = await fitdeskApi.put<PlanResponse>(
        `/billing/plans/${id}`,
        planData
      );
      console.log("✅ Plan actualizado exitosamente:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error actualizando plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al actualizar el plan");
    }
  }

  static async deletePlan(id: string): Promise<void> {
    try {
      await fitdeskApi.delete(`/billing/plans/${id}`);
      console.log("✅ Plan eliminado exitosamente");
    } catch (error: any) {
      console.error(`Error eliminando plan con ID ${id}:`, error);
      throw new Error(error.message || "Error al eliminar el plan");
    }
  }

  static async getPopularPlans(): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter((plan) => plan.isPopular);
    } catch (error: any) {
      console.error("Error obteniendo planes populares:", error);
      throw new Error(error.message || "Error al obtener planes populares");
    }
  }

  static async getPlansByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter(
        (plan) => plan.price >= minPrice && plan.price <= maxPrice
      );
    } catch (error: any) {
      console.error("Error filtrando planes por precio:", error);
      throw new Error(error.message || "Error al filtrar planes por precio");
    }
  }

  static async getPlansByDuration(months: number): Promise<PlanResponse[]> {
    try {
      const plans = await this.getActivePlans();
      return plans.filter((plan) => plan.durationMonths === months);
    } catch (error: any) {
      console.error("Error filtrando planes por duración:", error);
      throw new Error(error.message || "Error al filtrar planes por duración");
    }
  }

  static async getMyMembership(): Promise<UserMemberships> {
    try {
      const response = await fitdeskApi.get<UserMemberships>(
        `/members/memberships/my-active-membership`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error obteniendo membresía del usuario:", error);
      throw new Error(
        error.message || "Error al obtener la membresía del usuario"
      );
    }
  }
}
