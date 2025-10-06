import { z } from 'zod';
import { StatusSchema } from './common.schemas';


export const LocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nombre de ubicación requerido'),
  description: z.string().optional(),
  address: z.string().min(1, 'Dirección requerida'),
  city: z.string().min(1, 'Ciudad requerida'),
  state: z.string().min(1, 'Estado/Provincia requerido'),
  country: z.string().min(1, 'País requerido'),
  postalCode: z.string().min(1, 'Código postal requerido'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional(),
  capacity: z.number().min(1, 'Capacidad debe ser mayor a 0'),
  amenities: z.array(z.string()),
  operatingHours: z.object({
    monday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    tuesday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    wednesday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    thursday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    friday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    saturday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
    sunday: z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
      isClosed: z.boolean().default(false),
    }),
  }),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  images: z.array(z.string().url()).optional(),
  status: StatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateLocationSchema = LocationSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UpdateLocationSchema = LocationSchema.partial().extend({
  id: z.string().uuid(),
});

export const LocationFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  status: StatusSchema.optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  capacity: z.object({
    min: z.number().min(1).optional(),
    max: z.number().min(1).optional(),
  }).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.enum(['name', 'city', 'capacity', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ===== AMENITIES SCHEMAS =====

export const AmenitySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  category: z.enum(['FITNESS', 'WELLNESS', 'FACILITIES', 'SERVICES']),
});

export const LocationStatsSchema = z.object({
  totalLocations: z.number(),
  activeLocations: z.number(),
  totalCapacity: z.number(),
  averageCapacity: z.number(),
  locationsByStatus: z.object({
    active: z.number(),
    inactive: z.number(),
    suspended: z.number(),
  }),
  locationsByCity: z.array(z.object({
    city: z.string(),
    count: z.number(),
  })),
});
