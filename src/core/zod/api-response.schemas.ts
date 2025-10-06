import { z } from 'zod';
import { PaginationSchema } from './common.schemas';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string().datetime().optional(),
  });


export const PaginatedApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(itemSchema),
    pagination: PaginationSchema,
    timestamp: z.string().datetime().optional(),
  });


export const BaseApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown(), 
  timestamp: z.string().datetime().optional(),
});


export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string(),
    details: z.string().optional(),
    field: z.string().optional(),
  }).optional(),
  timestamp: z.string().datetime().optional(),
});


export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  timestamp: z.string().datetime().optional(),
});


export const FileUploadResponseSchema = ApiResponseSchema(
  z.object({
    filename: z.string(),
    originalName: z.string(),
    size: z.number(),
    mimetype: z.string(),
    url: z.string().url(),
  })
);


export const BulkOperationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  results: z.object({
    total: z.number(),
    successful: z.number(),
    failed: z.number(),
    errors: z.array(z.object({
      item: z.string(),
      error: z.string(),
    })).optional(),
  }),
  timestamp: z.string().datetime().optional(),
});


export const HealthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string().datetime(),
  services: z.record(z.string(), z.object({
    status: z.enum(['up', 'down']),
    responseTime: z.number().optional(),
  })).optional(),
});
