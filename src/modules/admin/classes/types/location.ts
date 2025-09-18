import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type Location = z.infer<typeof LocationSchema>;
export type CreateLocationDTO = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLocationDTO = Partial<CreateLocationDTO> & { id: string };
