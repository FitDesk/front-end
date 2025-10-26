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
  forceUpdate: number; // Add forceUpdate to trigger re-renders
  
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
    forceUpdate: 0,
    
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
      // Obtenemos el estado actual
      const state = get();
      const { currentDate, viewType } = state;
      
      // Forzamos la actualización al acceder a forceUpdate
      void state.forceUpdate;
      
      if (viewType === 'week') {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        
        const formatDayMonth = (date: Date) => {
          return format(date, 'd \'de\' MMM', { locale: es });
        };
        
        const formatFullDate = (date: Date) => {
          return format(date, 'd \'de\' MMMM yyyy', { locale: es });
        };
        
        if (weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear()) {
          return `${weekStart.getDate()} - ${formatFullDate(weekEnd)}`;
        } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
          return `${formatDayMonth(weekStart)} - ${formatFullDate(weekEnd)}`;
        } else {
          return `${formatFullDate(weekStart)} - ${formatFullDate(weekEnd)}`;
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
      const newDate = new Date(currentDate);
      
      if (viewType === 'week') {
        // Add exactly 7 days to move to the next week
        newDate.setDate(newDate.getDate() + 7);
      } else {
        // For month view, move to the same day in the next month
        newDate.setMonth(newDate.getMonth() + 1);
      }
      
      // Update the date and force a re-render
      state.currentDate = new Date(newDate);
      state.forceUpdate += 1;
    }),
    
    goToPrevious: () => set((state) => {
      const { currentDate, viewType } = get();
      const newDate = new Date(currentDate);
      
      if (viewType === 'week') {
        // Subtract exactly 7 days to move to the previous week
        newDate.setDate(newDate.getDate() - 7);
      } else {
        // For month view, move to the same day in the previous month
        newDate.setMonth(newDate.getMonth() - 1);
      }
      
      // Update the date and force a re-render
      state.currentDate = new Date(newDate);
      state.forceUpdate += 1;
    }),
    
    goToToday: () => set((state) => {
      // Update to today's date and force a re-render
      state.currentDate = new Date();
      state.forceUpdate += 1;
    }),
  }))
);
