import { create, type StateCreator } from 'zustand';
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


const planApi: StateCreator<PlanState> = (set) => ({
  ...initialState,
  setCurrentPlanId: (id) => set({ currentPlanId: id }),
  setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  reset: () => set(initialState),
})


export const usePlanStore = create<PlanState>()(
  devtools(
    planApi
  )
);


export const usePlanFilters = () => usePlanStore((state) => state.filters);
export const useCurrentPlanId = () => usePlanStore((state) => state.currentPlanId);
export const useIsDialogOpen = () => usePlanStore((state) => state.isDialogOpen);
