import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PlanState } from '../types';

const initialState: Omit<PlanState, 'setCurrentPlanId' | 'setIsDialogOpen' | 'setFilters' | 'reset'> = {
  currentPlanId: null,
  isDialogOpen: false,
  filters: {
    isActive: true,
    searchTerm: '',
    target: 'all',
  },
};

export const usePlanStore = create<PlanState>()(
  devtools(
    (set) => ({
      ...initialState,
      setCurrentPlanId: (id) => set({ currentPlanId: id }),
      setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
      setFilters: (filters) => 
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'plan-storage',
    }
  )
);


export const usePlanFilters = () => usePlanStore((state) => state.filters);
export const useCurrentPlanId = () => usePlanStore((state) => state.currentPlanId);
export const useIsDialogOpen = () => usePlanStore((state) => state.isDialogOpen);
