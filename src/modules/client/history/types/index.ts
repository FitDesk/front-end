import { z } from 'zod';



export const CLASS_STATUS = {
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;

export type ClassStatus = typeof CLASS_STATUS[keyof typeof CLASS_STATUS];



export const ProgressStatsSchema = z.object({
  completedClasses: z.number(),
  currentStreak: z.number(),
  totalCaloriesBurned: z.number(),
});

export const GoalsSchema = z.object({
  classesPerWeek: z.number().min(1).max(7),
  sessionDuration: z.number().min(15).max(180),
});

export const WeeklyProgressSchema = z.object({
  current: z.number(),
  target: z.number(),
  percentage: z.number(),
});

export const GeneralProgressSchema = z.object({
  currentMinutes: z.number(),
  targetMinutes: z.number(),
  percentage: z.number(),
});

export const AttendanceMonthSchema = z.object({
  month: z.string(),
  value: z.number(),
  height: z.string(),
});

export const ClassHistorySchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  status: z.enum(['completed', 'cancelled', 'pending']),
  caloriesBurned: z.number().optional(),
  duration: z.number().optional(),
  trainer: z.string().optional(),
});



export type ProgressStats = z.infer<typeof ProgressStatsSchema>;
export type Goals = z.infer<typeof GoalsSchema>;
export type WeeklyProgress = z.infer<typeof WeeklyProgressSchema>;
export type GeneralProgress = z.infer<typeof GeneralProgressSchema>;
export type AttendanceMonth = z.infer<typeof AttendanceMonthSchema>;
export type ClassHistory = z.infer<typeof ClassHistorySchema>;


export interface ProgressData {
  stats: ProgressStats;
  goals: Goals;
  weeklyProgress: WeeklyProgress;
  generalProgress: GeneralProgress;
  attendanceByMonth: AttendanceMonth[];
  classHistory: ClassHistory[];
}

export interface UpdateGoalsDTO {
  classesPerWeek: number;
  sessionDuration: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}


export interface HistoryFilters {
  status?: ClassStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
