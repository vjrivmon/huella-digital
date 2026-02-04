import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { searchFormSchema } from '@/lib/validations/search'
import { gdprRequestSchema } from '@/lib/validations/gdpr'

// Initialize Hono app
const app = new Hono().basePath('/api')

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ========== SEARCH ROUTES ==========
const searchRouter = new Hono()

// Create new search
searchRouter.post(
  '/',
  zValidator('json', searchFormSchema),
  async (c) => {
    const data = c.req.valid('json')
    
    // TODO: Implement actual search logic with Inngest
    return c.json({
      data: {
        id: `search_${Date.now()}`,
        status: 'pending',
        queryName: data.queryName,
        queryEmail: data.queryEmail ? data.queryEmail.replace(/(.{2}).*(@.*)/, '$1***$2') : null,
        queryUsernames: data.queryUsernames || [],
        estimatedTime: 45,
        createdAt: new Date().toISOString(),
      }
    }, 202)
  }
)

// List searches
searchRouter.get('/', async (c) => {
  // TODO: Implement with Supabase
  return c.json({
    data: [],
    meta: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    }
  })
})

// Get search by ID
searchRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  // TODO: Implement with Supabase
  return c.json({
    data: {
      id,
      status: 'completed',
      queryName: 'Demo User',
      totalResults: 0,
    }
  })
})

// Get search results
searchRouter.get('/:id/results', async (c) => {
  // TODO: Implement with Supabase
  return c.json({
    data: [],
    meta: {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    }
  })
})

app.route('/searches', searchRouter)

// ========== GDPR ROUTES ==========
const gdprRouter = new Hono()

// List templates
gdprRouter.get('/templates', async (c) => {
  // TODO: Fetch from Supabase
  return c.json({
    data: [
      {
        id: 'template_001',
        type: 'erasure',
        language: 'es',
        name: 'Solicitud de supresión estándar',
        description: 'Template general para solicitar eliminación de datos personales',
        legalBasis: 'RGPD Artículo 17 - Derecho de supresión',
        isDefault: true,
      },
      {
        id: 'template_002',
        type: 'access',
        language: 'es',
        name: 'Solicitud de acceso estándar',
        description: 'Template para solicitar acceso a datos personales',
        legalBasis: 'RGPD Artículo 15 - Derecho de acceso',
        isDefault: true,
      },
    ]
  })
})

// Create GDPR request
gdprRouter.post(
  '/requests',
  zValidator('json', gdprRequestSchema),
  async (c) => {
    const data = c.req.valid('json')
    
    // TODO: Generate actual request with PDF
    return c.json({
      data: {
        id: `gdpr_req_${Date.now()}`,
        status: 'ready',
        requestType: data.requestType,
        targetEntity: data.targetEntity,
        targetEmail: data.targetEmail,
        subject: `Solicitud de ${data.requestType === 'erasure' ? 'supresión' : 'acceso'} de datos personales - RGPD`,
        body: 'Contenido de la solicitud generada...',
        pdfUrl: null,
        createdAt: new Date().toISOString(),
      }
    }, 201)
  }
)

// List GDPR requests
gdprRouter.get('/requests', async (c) => {
  // TODO: Implement with Supabase
  return c.json({
    data: [],
    meta: {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      statusCounts: {
        draft: 0,
        ready: 0,
        sent: 0,
        completed: 0,
      }
    }
  })
})

// Get GDPR request by ID
gdprRouter.get('/requests/:id', async (c) => {
  const id = c.req.param('id')
  // TODO: Implement with Supabase
  return c.json({
    data: {
      id,
      status: 'draft',
      requestType: 'erasure',
      targetEntity: 'Demo Entity',
    }
  })
})

// Update GDPR request
gdprRouter.patch('/requests/:id', async (c) => {
  const id = c.req.param('id')
  // TODO: Implement with Supabase
  return c.json({
    data: {
      id,
      status: 'sent',
      updatedAt: new Date().toISOString(),
    }
  })
})

app.route('/gdpr', gdprRouter)

// ========== USER ROUTES ==========
const userRouter = new Hono()

userRouter.get('/profile', async (c) => {
  // TODO: Get from Supabase auth
  return c.json({
    data: {
      id: 'demo_user',
      email: 'demo@example.com',
      fullName: 'Usuario Demo',
      language: 'es',
      plan: 'free',
      searchesToday: 0,
      searchesLimit: 3,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    }
  })
})

userRouter.patch('/profile', async (c) => {
  // TODO: Update in Supabase
  return c.json({
    data: {
      updatedAt: new Date().toISOString(),
    }
  })
})

app.route('/user', userRouter)

// Export handlers for Next.js
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
