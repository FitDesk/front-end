export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  target: 'all' | 'members' | 'trainers';
  code?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  features: string[];
  isPopular?: boolean;
  currency?: string;
  promotions?: Promotion[];
}


export interface PlanFilters {
  isActive?: boolean;
  searchTerm?: string;
  target?: 'all' | 'members' | 'trainers';
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}


export interface CreatePlanDto extends Omit<Plan, 'id' | 'promotions'> {}
export interface UpdatePlanDto extends Partial<CreatePlanDto> {}


export interface PlanState {
 
  currentPlanId: string | null;
  isDialogOpen: boolean;
  filters: PlanFilters;
  
 
  setCurrentPlanId: (id: string | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setFilters: (filters: Partial<PlanFilters>) => void;
  reset: () => void;
}
