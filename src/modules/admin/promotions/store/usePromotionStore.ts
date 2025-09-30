import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Promotion } from '../types/promotion';

interface PromotionFilters {
  readonly searchTerm: string;
  readonly isActive: boolean | null;
  readonly target: 'all' | 'members' | 'trainers';
}

interface PromotionState {

  promotions: Promotion[];
  currentPromotion: Promotion | null;
  isDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
  filters: PromotionFilters;


  setPromotions: (promotions: Promotion[]) => void;
  setCurrentPromotion: (promotion: Promotion | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PromotionFilters>) => void;
  reset: () => void;
}

const initialState: Omit<PromotionState, 
  'setPromotions' | 'setCurrentPromotion' | 'setIsDialogOpen' | 
  'setLoading' | 'setError' | 'setFilters' | 'reset'
> = {
  promotions: [],
  currentPromotion: null,
  isDialogOpen: false,
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    isActive: null,
    target: 'all',
  } as const, 
};

export const usePromotionStore = create<PromotionState>()(
  devtools(
    immer((set) => ({
      ...initialState,
      setPromotions: (promotions) => 
        set((state) => {
          state.promotions = promotions;
        }),
      
      setCurrentPromotion: (promotion) => 
        set((state) => {
          state.currentPromotion = promotion;
        }),
      
      setIsDialogOpen: (isOpen) => 
        set((state) => {
          state.isDialogOpen = isOpen;
          if (!isOpen) state.currentPromotion = null;
        }),
      
      setLoading: (isLoading) => 
        set((state) => {
          state.isLoading = isLoading;
        }),
      
      setError: (error) => 
        set((state) => {
          state.error = error;
        }),
      
      setFilters: (filters) => 
        set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),
      
      reset: () => set(() => ({
        ...initialState,
        filters: { ...initialState.filters }
      })),
    })),
    { name: 'promotion-store' }
  )
);


export const usePromotionFilters = () => 
  usePromotionStore((state) => state.filters);

export const useFilteredPromotions = () =>
  usePromotionStore((state) => {
    const { promotions, filters } = state;
    return promotions.filter((promotion) => {
      const matchesSearch = filters.searchTerm
        ? promotion.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          promotion.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;

      const matchesStatus =
        filters.isActive === null ? true : promotion.isActive === filters.isActive;

      const matchesTarget =
        filters.target === 'all' ? true : promotion.target === filters.target;

      return matchesSearch && matchesStatus && matchesTarget;
    });
  });
