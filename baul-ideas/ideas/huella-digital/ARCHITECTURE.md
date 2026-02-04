# Arquitectura - Huella Digital

> Documento de arquitectura tecnica para la aplicacion de gestion de presencia digital.

**Version:** 1.0  
**Fecha:** 2026-02-04  
**Estado:** Aprobado para implementacion

---

## 1. Diagrama de Arquitectura

```
                                    CLIENTE
    +------------------------------------------------------------------+
    |                                                                  |
    |    +------------------+     +------------------+                 |
    |    |   Landing Page   |     |   Web App (SPA)  |                 |
    |    |   (SSR/SEO)      |     |   Dashboard      |                 |
    |    +--------+---------+     +--------+---------+                 |
    |             |                        |                           |
    +-------------|------------------------|---------------------------+
                  |                        |
                  +----------+-------------+
                             |
                             | HTTPS
                             v
    +------------------------------------------------------------------+
    |                     NEXT.JS 14 (VERCEL)                          |
    |                                                                  |
    |  +------------------+  +------------------+  +----------------+  |
    |  |   Pages/Routes   |  |   API Routes     |  |  Middleware    |  |
    |  |   (App Router)   |  |   (/api/*)       |  |  (Auth/i18n)   |  |
    |  +--------+---------+  +--------+---------+  +-------+--------+  |
    |           |                     |                    |           |
    +-----------|---------------------|--------------------|-----------+
                |                     |                    |
                v                     v                    v
    +------------------------------------------------------------------+
    |                      HONO (API LAYER)                            |
    |                                                                  |
    |  +---------------+  +---------------+  +---------------+         |
    |  | SearchService |  | GDPRService   |  | TrackingServ  |         |
    |  +-------+-------+  +-------+-------+  +-------+-------+         |
    |          |                  |                  |                 |
    +----------|------------------|------------------|------------------+
               |                  |                  |
               v                  v                  v
    +------------------------------------------------------------------+
    |                        INNGEST (QUEUE)                           |
    |                                                                  |
    |  +------------------+  +------------------+  +----------------+  |
    |  | search.execute   |  | search.aggregate |  | gdpr.reminder  |  |
    |  +--------+---------+  +--------+---------+  +--------+-------+  |
    |           |                     |                     |          |
    +-----------|---------------------|---------------------|----------+
                |                     |                     |
                v                     v                     v
    +------------------------------------------------------------------+
    |                    SUPABASE (BACKEND)                            |
    |                                                                  |
    |  +---------------+  +---------------+  +---------------+         |
    |  |  PostgreSQL   |  |   Auth        |  |   Storage     |         |
    |  |  (Database)   |  |   (JWT)       |  |   (PDFs)      |         |
    |  +---------------+  +---------------+  +---------------+         |
    |                                                                  |
    +------------------------------------------------------------------+
                |
                v
    +------------------------------------------------------------------+
    |                    SERVICIOS EXTERNOS                            |
    |                                                                  |
    |  +---------------+  +---------------+  +---------------+         |
    |  | Google Custom |  | Have I Been   |  | Resend        |         |
    |  | Search API    |  | Pwned API     |  | (Email)       |         |
    |  +---------------+  +---------------+  +---------------+         |
    |                                                                  |
    +------------------------------------------------------------------+
```

---

## 2. Estructura de Carpetas

```
huella-digital/
|
|-- apps/
|   |-- web/                          # Next.js 14 App
|   |   |-- src/
|   |   |   |-- app/                  # App Router
|   |   |   |   |-- (auth)/           # Rutas autenticadas
|   |   |   |   |   |-- dashboard/
|   |   |   |   |   |-- results/
|   |   |   |   |   |-- gdpr/
|   |   |   |   |   |-- tracker/
|   |   |   |   |   |-- settings/
|   |   |   |   |-- (marketing)/      # Rutas publicas
|   |   |   |   |   |-- page.tsx      # Landing
|   |   |   |   |   |-- pricing/
|   |   |   |   |   |-- about/
|   |   |   |   |-- api/              # API Routes (Hono)
|   |   |   |   |   |-- [...route]/
|   |   |   |   |-- layout.tsx
|   |   |   |   |-- globals.css
|   |   |   |-- components/
|   |   |   |   |-- ui/               # shadcn/ui
|   |   |   |   |-- forms/
|   |   |   |   |-- layout/
|   |   |   |   |-- search/
|   |   |   |   |-- gdpr/
|   |   |   |   |-- tracker/
|   |   |   |-- lib/
|   |   |   |   |-- supabase/
|   |   |   |   |   |-- client.ts
|   |   |   |   |   |-- server.ts
|   |   |   |   |   |-- middleware.ts
|   |   |   |   |-- utils/
|   |   |   |   |-- hooks/
|   |   |   |   |-- validations/
|   |   |   |-- i18n/
|   |   |   |   |-- locales/
|   |   |   |   |   |-- es.json
|   |   |   |   |   |-- en.json
|   |   |   |   |-- config.ts
|   |   |   |-- types/
|   |   |-- public/
|   |   |-- next.config.js
|   |   |-- tailwind.config.ts
|   |   |-- tsconfig.json
|   |   |-- package.json
|
|-- packages/
|   |-- api/                          # Hono API (shared)
|   |   |-- src/
|   |   |   |-- routes/
|   |   |   |   |-- search.ts
|   |   |   |   |-- gdpr.ts
|   |   |   |   |-- tracker.ts
|   |   |   |   |-- user.ts
|   |   |   |-- services/
|   |   |   |   |-- search/
|   |   |   |   |   |-- google.ts
|   |   |   |   |   |-- hibp.ts
|   |   |   |   |   |-- username.ts
|   |   |   |   |   |-- aggregator.ts
|   |   |   |   |-- gdpr/
|   |   |   |   |   |-- templates.ts
|   |   |   |   |   |-- generator.ts
|   |   |   |   |   |-- pdf.ts
|   |   |   |   |-- email/
|   |   |   |   |   |-- resend.ts
|   |   |   |-- middleware/
|   |   |   |   |-- auth.ts
|   |   |   |   |-- ratelimit.ts
|   |   |   |   |-- validation.ts
|   |   |   |-- index.ts
|   |   |-- package.json
|   |
|   |-- database/                     # Supabase types y migrations
|   |   |-- migrations/
|   |   |-- types/
|   |   |   |-- database.types.ts
|   |   |-- seed/
|   |   |-- package.json
|   |
|   |-- jobs/                         # Inngest jobs
|   |   |-- src/
|   |   |   |-- client.ts
|   |   |   |-- functions/
|   |   |   |   |-- search-execute.ts
|   |   |   |   |-- search-aggregate.ts
|   |   |   |   |-- gdpr-reminder.ts
|   |   |   |   |-- cleanup-old-data.ts
|   |   |-- package.json
|   |
|   |-- shared/                       # Tipos y utilidades compartidas
|       |-- src/
|       |   |-- types/
|       |   |-- constants/
|       |   |-- utils/
|       |-- package.json
|
|-- tooling/                          # Configuracion compartida
|   |-- eslint/
|   |-- typescript/
|   |-- prettier/
|
|-- docker-compose.yml                # Dev local (Supabase, Redis)
|-- turbo.json                        # Turborepo config
|-- package.json                      # Workspace root
|-- pnpm-workspace.yaml
|-- README.md
```

---

## 3. Componentes Principales

### 3.1 Frontend (apps/web)

| Componente | Responsabilidad |
|------------|-----------------|
| **App Router** | Enrutamiento, layouts, middleware de auth |
| **Pages** | Vistas de cada seccion (dashboard, results, gdpr, tracker) |
| **Components** | UI reutilizable basada en shadcn/ui |
| **Lib/Supabase** | Cliente Supabase para auth y datos |
| **i18n** | Internacionalizacion (es/en) con next-intl |
| **Hooks** | Logica de estado compartida (useSearch, useGDPR) |

### 3.2 API (packages/api)

| Componente | Responsabilidad |
|------------|-----------------|
| **Routes** | Endpoints REST organizados por dominio |
| **Services/Search** | Integracion con Google, HIBP, username enumeration |
| **Services/GDPR** | Generacion de templates y PDFs |
| **Services/Email** | Envio de solicitudes via Resend |
| **Middleware** | Auth, rate limiting, validacion |

### 3.3 Jobs (packages/jobs)

| Componente | Responsabilidad |
|------------|-----------------|
| **search-execute** | Ejecuta busquedas en APIs externas (async) |
| **search-aggregate** | Consolida resultados de multiples fuentes |
| **gdpr-reminder** | Envia recordatorios de solicitudes pendientes |
| **cleanup-old-data** | Purga datos antiguos (cumplimiento GDPR) |

### 3.4 Database (packages/database)

| Componente | Responsabilidad |
|------------|-----------------|
| **Migrations** | Versionado del schema |
| **Types** | Tipos TypeScript generados desde Supabase |
| **Seed** | Datos iniciales (templates GDPR) |

---

## 4. Flujo de Datos

### 4.1 Flujo de Busqueda

```
Usuario                Frontend              API                 Queue              External APIs
   |                      |                   |                    |                      |
   |--1. Nueva busqueda-->|                   |                    |                      |
   |                      |--2. POST /search->|                    |                      |
   |                      |                   |--3. Crear search-->|                      |
   |                      |                   |     (status:       |                      |
   |                      |                   |      pending)      |                      |
   |                      |                   |--4. Trigger job--->|                      |
   |                      |<--5. 202 Accepted-|                    |                      |
   |<--6. Mostrar loader--|                   |                    |                      |
   |                      |                   |                    |--7. Google Search--->|
   |                      |                   |                    |<--8. Results---------|
   |                      |                   |                    |--9. HIBP API-------->|
   |                      |                   |                    |<--10. Breaches-------|
   |                      |                   |                    |--11. Username enum-->|
   |                      |                   |                    |<--12. Profiles-------|
   |                      |                   |<--13. Save results-|                      |
   |                      |                   |     (status:       |                      |
   |                      |                   |      completed)    |                      |
   |                      |<--14. Webhook-----|                    |                      |
   |<--15. Actualizar UI--|                   |                    |                      |
   |                      |                   |                    |                      |
```

### 4.2 Flujo de Generacion GDPR

```
Usuario                Frontend              API                 Storage
   |                      |                   |                    |
   |--1. Selecciona------>|                   |                    |
   |   resultado          |                   |                    |
   |--2. Click "Generar-->|                   |                    |
   |   solicitud GDPR"    |                   |                    |
   |                      |--3. POST /gdpr--->|                    |
   |                      |   /requests       |                    |
   |                      |                   |--4. Genera PDF---->|
   |                      |                   |<--5. URL PDF-------|
   |                      |                   |--6. Guarda req---->|
   |                      |<--7. Response-----|                    |
   |<--8. Descargar PDF---|                   |                    |
   |                      |                   |                    |
```

### 4.3 Flujo de Tracking

```
Usuario                Frontend              API                 Database
   |                      |                   |                    |
   |--1. Marca como------>|                   |                    |
   |   "enviada"          |                   |                    |
   |                      |--2. PATCH-------->|                    |
   |                      |   /tracker/{id}   |                    |
   |                      |                   |--3. Update-------->|
   |                      |                   |     status         |
   |                      |                   |--4. Schedule------>|
   |                      |                   |     reminder (30d) |
   |                      |<--5. 200 OK-------|                    |
   |<--6. UI actualizado--|                   |                    |
   |                      |                   |                    |
   |      ... 30 dias ... |                   |                    |
   |                      |                   |                    |
   |<--7. Email/push------|<--8. Job reminder-|<--9. Check---------|
   |   "Solicitud sin     |                   |     pending        |
   |    respuesta"        |                   |                    |
```

---

## 5. Decisiones Tecnicas

### 5.1 Monorepo con Turborepo

**Decision:** Usar monorepo con pnpm workspaces y Turborepo.

**Justificacion:**
- Codigo compartido entre web y jobs sin publicar paquetes
- Builds incrementales y cache
- Un solo repo para todo el proyecto
- Facilita CI/CD unificado

**Alternativas consideradas:**
- Multirepo: Mayor complejidad de gestion
- npm workspaces: Menos features que pnpm

### 5.2 Hono sobre Express

**Decision:** Usar Hono como framework API.

**Justificacion:**
- Rendimiento superior (basado en Web Standards)
- Funciona en Edge (Vercel Edge Functions)
- TypeScript-first con validacion Zod integrada
- Middleware similar a Express pero mas moderno
- Menor bundle size

**Alternativas consideradas:**
- Express: Mas pesado, no optimizado para edge
- tRPC: Overhead para API publica

### 5.3 Inngest sobre BullMQ

**Decision:** Usar Inngest para jobs asincronos.

**Justificacion:**
- Serverless-native (no necesita Redis propio)
- UI de debugging incluida
- Reintentos y backoff automaticos
- Funciones tipadas con TypeScript
- Facil integracion con Vercel

**Alternativas consideradas:**
- BullMQ + Redis: Requiere infraestructura adicional
- Trigger.dev: Similar pero menos maduro

### 5.4 Supabase como Backend

**Decision:** Usar Supabase para database, auth y storage.

**Justificacion:**
- PostgreSQL robusto con RLS (seguridad a nivel de fila)
- Auth integrado con multiples providers
- Storage para PDFs generados
- Realtime para actualizaciones de busquedas
- Generous free tier para MVP
- SDK TypeScript excelente

**Alternativas consideradas:**
- Firebase: NoSQL no ideal para relaciones complejas
- Auth0 + PlanetScale: Mas servicios que gestionar

### 5.5 next-intl para i18n

**Decision:** Usar next-intl para internacionalizacion.

**Justificacion:**
- Integracion nativa con App Router
- Server Components support
- Type-safe con TypeScript
- Formateo de fechas/numeros incluido

**Alternativas consideradas:**
- react-i18next: Menos integrado con Next.js 14
- next-translate: Menos mantenido

### 5.6 Estrategia de Rate Limiting

**Decision:** Rate limiting en tres niveles.

```
1. Nivel API (middleware):
   - 100 requests/minuto por usuario autenticado
   - 10 requests/minuto por IP (no autenticado)

2. Nivel de busqueda:
   - 5 busquedas/dia (plan free)
   - 50 busquedas/dia (plan pro)
   - Cooldown de 1 minuto entre busquedas

3. Nivel de API externa:
   - Google: max 100 queries/dia (limite API)
   - HIBP: 1 request/1.5s (limite API)
   - Queue con rate limiting por servicio
```

**Implementacion:** Upstash Redis para rate limiting distribuido.

### 5.7 Cifrado y Seguridad

**Decision:** Cifrado en multiples capas.

```
1. Transito: HTTPS obligatorio (Vercel)
2. Reposo: Cifrado de Supabase (AES-256)
3. Aplicacion: Campos sensibles cifrados con crypto
   - Emails de busqueda
   - Resultados con datos personales
4. PDFs: Firmados y con password opcional
```

**Almacenamiento minimo:**
- Resultados de busqueda: 30 dias maximo
- PDFs generados: 7 dias
- Logs de auditoria: 90 dias

---

## 6. Escalabilidad

### 6.1 Puntos de Escala

| Componente | Estrategia de escala |
|------------|---------------------|
| Frontend | Vercel Edge (automatico) |
| API | Serverless functions (automatico) |
| Database | Supabase Pro (connection pooling) |
| Jobs | Inngest (serverless, automatico) |
| Storage | Supabase Storage (CDN incluido) |

### 6.2 Cuellos de Botella Anticipados

1. **APIs externas (Google, HIBP)**
   - Mitigacion: Cache agresivo de resultados
   - Plan B: Multiples API keys rotativas

2. **Generacion de PDFs**
   - Mitigacion: Queue con prioridades
   - Plan B: Servicio dedicado (ej: api2pdf)

3. **Busquedas concurrentes**
   - Mitigacion: Rate limiting por usuario
   - Plan B: Arquitectura de cola con prioridades

### 6.3 Metricas a Monitorear

- Tiempo de respuesta de busquedas (p50, p95, p99)
- Tasa de error de APIs externas
- Uso de cuotas de API
- Tiempo de generacion de PDFs
- Usuarios activos diarios/mensuales

---

## 7. Seguridad

### 7.1 Autenticacion

- Supabase Auth con email/password y magic link
- JWT con refresh tokens
- Session management en server-side

### 7.2 Autorizacion

- RLS en todas las tablas (Supabase)
- Usuario solo ve sus propios datos
- Verificacion de ownership en cada endpoint

### 7.3 Proteccion de Datos

- Inputs sanitizados con Zod
- CSP headers configurados
- Rate limiting contra abuso
- Logs de auditoria para acciones sensibles

### 7.4 Cumplimiento GDPR

- Consentimiento explicito en registro
- Exportacion de datos del usuario
- Eliminacion completa de cuenta
- Politica de privacidad clara
- DPA (Data Processing Agreement) para servicios externos

---

*Documento generado para Huella Digital - 2026-02-04*
