import { z } from 'zod';


export const DayOfWeekEnum = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
} as const;

export type DayOfWeek = typeof DayOfWeekEnum[keyof typeof DayOfWeekEnum];


export type Location = string;

export const DAYS_OF_WEEK = Object.values(DayOfWeekEnum);

export const DURATION_OPTIONS = [30, 45, 60, 90] as const;
export type DurationOption = typeof DURATION_OPTIONS[number];


const DayOfWeekSchema = z.nativeEnum(DayOfWeekEnum);


export const ClassSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  trainerId: z.string().min(1, 'Selecciona un entrenador'),
  dayOfWeek: DayOfWeekSchema,
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida'),
  duration: z.number().min(30, 'La duración mínima es de 30 minutos'),
  capacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  location: z.string().min(1, 'Selecciona una ubicación'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type Class = z.infer<typeof ClassSchema>;
export type CreateClassDTO = Omit<Class, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClassDTO = Partial<CreateClassDTO> & { id: string };
