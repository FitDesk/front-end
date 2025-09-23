import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PromotionService } from '../services/promotion.service';
import type { Promotion, CreatePromotionDTO, UpdatePromotionDTO } from '../types/promotion';
import { usePromotionStore } from '../store/usePromotionStore';

const PROMOTION_QUERY_KEY = 'promotions';

export const usePromotions = () => {
  const { setPromotions, setLoading, setError } = usePromotionStore();

  return useQuery<Promotion[]>({
    queryKey: [PROMOTION_QUERY_KEY],
    queryFn: async () => {
      try {
        setLoading(true);
        const data = await PromotionService.getAll();
        setPromotions(data);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al cargar promociones';
        setError(message);
        throw error;
      }
    },
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = usePromotionStore();

  return useMutation({
    mutationFn: async (promotion: CreatePromotionDTO) => {
      try {
        setLoading(true);
        return await PromotionService.create(promotion);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al crear la promoción';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = usePromotionStore();

  return useMutation({
    mutationFn: async ({ id, promotion }: { id: string; promotion: Omit<UpdatePromotionDTO, 'id'> }) => {
      try {
        setLoading(true);
        return await PromotionService.update(id, promotion);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al actualizar la promoción';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = usePromotionStore();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        setLoading(true);
        await PromotionService.delete(id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al eliminar la promoción';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY] });
    },
  });
};

export const useSendPromotion = () => {
  const { setLoading, setError } = usePromotionStore();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        setLoading(true);
        return await PromotionService.sendPromotion(id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al enviar la promoción';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
};
