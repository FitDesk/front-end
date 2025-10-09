import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlanService } from "../services/plan.service";
import type {
  CreatePlanRequest,
  UpdatePlanRequest,
} from "@/core/interfaces/plan.interface";

export const useActivePlans = () => {
  return useQuery({
    queryKey: ["plans", "active"],
    queryFn: PlanService.getActivePlans,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllPlans = () => {
  return useQuery({
    queryKey: ["plans", "all"],
    queryFn: PlanService.getAllPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlanById = (id: string) => {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: () => PlanService.getPlanById(id),
    enabled: !!id, 
  });
};

export const usePopularPlans = () => {
  return useQuery({
    queryKey: ["plans", "popular"],
    queryFn: PlanService.getPopularPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlansByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: ["plans", "price-range", minPrice, maxPrice],
    queryFn: () => PlanService.getPlansByPriceRange(minPrice, maxPrice),
    enabled: minPrice >= 0 && maxPrice > minPrice,
  });
};

export const usePlansByDuration = (months: number) => {
  return useQuery({
    queryKey: ["plans", "duration", months],
    queryFn: () => PlanService.getPlansByDuration(months),
    enabled: months > 0,
  });
};


export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: CreatePlanRequest) =>
      PlanService.createPlan(planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      PlanService.updatePlan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plans", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["plans", "active"] });
      queryClient.invalidateQueries({ queryKey: ["plans", "all"] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlanService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};
