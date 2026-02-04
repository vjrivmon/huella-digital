import { z } from 'zod'

export const gdprRequestSchema = z.object({
  searchResultId: z.string().uuid().optional(),
  templateId: z.string().uuid(),
  requestType: z.enum(['erasure', 'access', 'rectification', 'portability']),
  targetEntity: z.string().min(1, 'El nombre de la entidad es requerido').max(200),
  targetEmail: z.string().email('Formato de email inválido').optional().or(z.literal('')),
  targetAddress: z.string().max(500).optional(),
  targetCountry: z.string().length(2).optional(),
  customizations: z.object({
    targetDataDescription: z.string().max(2000).optional(),
    additionalNotes: z.string().max(1000).optional(),
  }).optional(),
  generatePdf: z.boolean().default(true),
})

export type GdprRequestFormData = z.infer<typeof gdprRequestSchema>

export const updateGdprRequestSchema = z.object({
  status: z.enum(['draft', 'ready', 'sent', 'acknowledged', 'completed', 'rejected', 'escalated']).optional(),
  sentAt: z.string().datetime().optional(),
  sentMethod: z.enum(['email', 'postal', 'form']).optional(),
  acknowledgedAt: z.string().datetime().optional(),
  responseAt: z.string().datetime().optional(),
  responseSummary: z.string().max(2000).optional(),
  escalatedTo: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
})

export type UpdateGdprRequestData = z.infer<typeof updateGdprRequestSchema>
