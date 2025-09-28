import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  format
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalendarFilters } from '../types';

interface CalendarStore {
  currentDate: Date;
  viewType: 'week' | 'month';
  filters: CalendarFilters;
  selectedDate: Date | null;
  

  dateRange: { start: Date; end: Date };
  calendarTitle: string;
  
  setCurrentDate: (date: Date) => void;
  setViewType: (view: 'week' | 'month') => void;
  updateFilters: (filters: Partial<CalendarFilters>) => void;
  clearFilters: () => void;
  setSelectedDate: (date: Date | null) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarStore>()(
  immer((set, get) => ({
    currentDate: new Date(),
    viewType: 'week',
    filters: {},
    selectedDate: null,
    
    // Computed properties
    get dateRange() {
      const { currentDate, viewType } = get();
      if (viewType === 'week') {
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        };
      } else {
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      }
    },
    
    get calendarTitle() {
      const { currentDate, viewType } = get();
      if (viewType === 'week') {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${format(weekStart, 'd', { locale: es })} - ${format(weekEnd, 'd \'de\' MMMM yyyy', { locale: es })}`;
        } else {
          return `${format(weekStart, 'd \'de\' MMM', { locale: es })} - ${format(weekEnd, 'd \'de\' MMM yyyy', { locale: es })}`;
        }
      } else {
        return format(currentDate, 'MMMM yyyy', { locale: es });
      }
    },
    
    setCurrentDate: (date) => set((state) => {
      state.currentDate = date;
    }),
    
    setViewType: (view) => set((state) => {
      state.viewType = view;
    }),
    
    updateFilters: (newFilters) => set((state) => {
      Object.assign(state.filters, newFilters);
    }),
    
    clearFilters: () => set((state) => {
      state.filters = {};
    }),
    
    setSelectedDate: (date) => set((state) => {
      state.selectedDate = date;
    }),
    
    goToNext: () => set((state) => {
      const { currentDate, viewType } = get();
      if (viewType === 'week') {
        state.currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        state.currentDate = nextMonth;
      }
    }),
    
    goToPrevious: () => set((state) => {
      const { currentDate, viewType } = get();
      if (viewType === 'week') {
        state.currentDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        state.currentDate = prevMonth;
      }
    }),
    
    goToToday: () => set((state) => {
      state.currentDate = new Date();
    }),
  }))
);
