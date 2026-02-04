import { z } from 'zod'

export const searchFormSchema = z.object({
  queryName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  queryEmail: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  queryUsernames: z
    .array(z.string().min(3).max(30))
    .max(5, 'Máximo 5 usernames')
    .optional(),
})

export type SearchFormData = z.infer<typeof searchFormSchema>

export const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  sortBy: z.enum(['createdAt', 'totalResults']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SearchParams = z.infer<typeof searchParamsSchema>
