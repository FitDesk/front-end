export interface PlanResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  currency: string;
  isActive: boolean;
  isPopular: boolean;
  features: string[];
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  durationMonths: number;
  currency?: string;
  isActive?: boolean;
  isPopular?: boolean;
  features?: string[];
}

export interface UpdatePlanRequest extends CreatePlanRequest {}
