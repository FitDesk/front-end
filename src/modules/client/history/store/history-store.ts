import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { HistoryFilters } from '../types';

interface HistoryState {
  filters: HistoryFilters;
  isGoalsModalOpen: boolean;

  setFilters: (filters: Partial<HistoryFilters>) => void;
  resetFilters: () => void;
  setGoalsModalOpen: (isOpen: boolean) => void;
}

const initialFilters: HistoryFilters = {
  status: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  searchTerm: undefined,
};

export const useHistoryStore = create<HistoryState>()(
  devtools(
    immer((set) => ({
      filters: initialFilters,
      isGoalsModalOpen: false,
      setFilters: (newFilters) =>
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
        }),
      
      resetFilters: () =>
        set((state) => {
          state.filters = initialFilters;
        }),
      
      setGoalsModalOpen: (isOpen) =>
        set((state) => {
          state.isGoalsModalOpen = isOpen;
        }),
    })),
    { name: 'history-store' }
  )
);
