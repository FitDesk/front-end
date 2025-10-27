import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  startOfWeek, 
  endOfWeek
} from 'date-fns';

interface CalendarStore {
  currentDate: Date;
  selectedDate: Date | null;
  
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToToday: () => void;
  goToDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  immer((set, get) => ({
    currentDate: new Date(),
    selectedDate: null,
    
    setCurrentDate: (date) => set((state) => {
      state.currentDate = date;
    }),
    
    setSelectedDate: (date) => set((state) => {
      state.selectedDate = date;
    }),
    
    goToNext: () => set((state) => {
      const { currentDate } = get();
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      console.log(`⏭️ goToNext:`, {
        fechaAnterior: currentDate.toISOString(),
        fechaNueva: newDate.toISOString()
      });
      state.currentDate = new Date(newDate);
    }),
    
    goToPrevious: () => set((state) => {
      const { currentDate } = get();
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      console.log(`⏮️ goToPrevious:`, {
        fechaAnterior: currentDate.toISOString(),
        fechaNueva: newDate.toISOString()
      });
      state.currentDate = new Date(newDate);
    }),
    
    goToToday: () => set((state) => {
      const today = new Date();
      console.log(`📅 goToToday:`, today.toISOString());
      state.currentDate = today;
    }),
    
    goToDate: (date) => set((state) => {
      console.log(`📅 goToDate:`, date.toISOString());
      state.currentDate = new Date(date);
    }),
  }))
);

// Selector para obtener el rango de fechas del calendario
export function useCalendarDateRange() {
  return useCalendarStore((state) => {
    const start = startOfWeek(state.currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(state.currentDate, { weekStartsOn: 1 });
    console.log(`📆 dateRange calculado en selector:`, {
      currentDate: state.currentDate.toISOString(),
      start: start.toISOString(),
      end: end.toISOString()
    });
    return { start, end };
  });
}
