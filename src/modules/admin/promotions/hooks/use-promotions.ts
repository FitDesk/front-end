import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PromotionService } from '../services/promotion.service';
import type { Promotion, CreatePromotionDTO, UpdatePromotionDTO } from '../types/promotion';

const PROMOTION_QUERY_KEY = 'promotions';

export const usePromotions = () => {
  return useQuery<Promotion[]>({
    queryKey: [PROMOTION_QUERY_KEY],
    queryFn: () => PromotionService.getAll(),
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotion: CreatePromotionDTO) => PromotionService.create(promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, promotion }: { id: string; promotion: Omit<UpdatePromotionDTO, 'id'> }) =>
      PromotionService.update(id, promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PromotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useSendPromotion = () => {
  return useMutation({
    mutationFn: (id: string) => PromotionService.sendPromotion(id),
  });
};
