# Arquitectura — App de Pus

## Level 1: Diagrama de Contexto

```
                    ┌─────────────┐
                    │   Vicente   │
                    │   & Irene   │
                    └──────┬──────┘
                           │ HTTPS (PWA)
                           ▼
                    ┌─────────────┐
                    │  App de Pus │
                    │  (Next.js)  │
                    └──┬───┬───┬──┘
                       │   │   │
            ┌──────────┘   │   └──────────┐
            ▼              ▼              ▼
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │  Supabase  │ │   Gemini   │ │   Vercel   │
     │  (BaaS)    │ │  Flash API │ │  (Hosting) │
     └────────────┘ └────────────┘ └────────────┘
```

**Actores:**
- **Vicente & Irene** — Únicos 2 usuarios. Acceden desde móvil (80%) y escritorio (20%).
- **App de Pus** — PWA Next.js. Toda la lógica de UI y coordinación.
- **Supabase** — Auth (magic link), PostgreSQL, Storage (fotos OCR), Realtime (sync entre usuarios).
- **Gemini Flash API** — Extracción de precios desde fotos de etiquetas.
- **Vercel** — Hosting de la app Next.js (free tier).

---

## Level 2: Diagrama de Contenedores

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 App                        │  │
│  │                                                    │  │
│  │  ┌─────────────┐  ┌────────────────────────────┐  │  │
│  │  │   Pages     │  │     API Routes             │  │  │
│  │  │  (React 19  │  │  /api/ocr-price            │  │  │
│  │  │   + Tailwind│  │  /api/generate-lista       │  │  │
│  │  │   PWA)      │  │  /api/estimate-cost        │  │  │
│  │  └─────────────┘  └────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────────┐  ┌───────────────┐
│        Supabase          │  │  Gemini 2.0   │
│                          │  │  Flash API    │
│  ┌────────┐ ┌─────────┐ │  │               │
│  │  Auth  │ │   DB    │ │  │  POST /v1/    │
│  │ (Magic │ │ (Postgr │ │  │  models/      │
│  │  Link) │ │  eSQL)  │ │  │  gemini-2.0-  │
│  └────────┘ └─────────┘ │  │  flash:       │
│  ┌────────┐ ┌─────────┐ │  │  generate     │
│  │Storage │ │Realtime │ │  │  Content      │
│  │ (fotos)│ │ (sync)  │ │  └───────────────┘
│  └────────┘ └─────────┘ │
└──────────────────────────┘
```

### Contenedores

| Contenedor | Tecnología | Responsabilidad |
|---|---|---|
| **Next.js App** | Next.js 15, React 19, Tailwind | UI completa, PWA, service worker |
| **Pages (CSR/SSR)** | App Router | Pantallas: compra, historial, menú, gastos |
| **API Routes** | Next.js Route Handlers | Proxy a Gemini (no exponer API key), lógica server |
| **Supabase Auth** | Magic Link (email) | Login sin contraseña, sesión JWT |
| **Supabase DB** | PostgreSQL + RLS | Datos, queries, políticas de acceso |
| **Supabase Storage** | S3-compatible | Fotos de precios para OCR |
| **Supabase Realtime** | WebSocket | Sync lista/menú entre Vicente e Irene |
| **Gemini Flash** | REST API | Extraer precio de foto de etiqueta |

---

## Level 3: Diagrama de Componentes (dentro de Next.js App)

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                    Auth Module                     │   │
│  │  - Login page (magic link)                        │   │
│  │  - AuthProvider (context)                         │   │
│  │  - Middleware (proteger rutas)                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────┐  ┌────────────────────────────┐  │
│  │  CompraInteligente │  │      CameraOCR            │  │
│  │                    │  │                            │  │
│  │  - ListaCompra     │  │  - CameraCapture          │  │
│  │  - CarritoActivo   │  │  - PriceExtractor         │  │
│  │  - PresupuestoBar  │  │  - PhotoUploader          │  │
│  │  - ProductoInput   │  │  (→ Storage + Gemini)     │  │
│  │  - ChecklistItem   │  │                            │  │
│  └────────┬──────────┘  └────────────────────────────┘  │
│           │                                              │
│  ┌────────┴──────────┐  ┌────────────────────────────┐  │
│  │    Historial      │  │     MenuSemanal            │  │
│  │                    │  │                            │  │
│  │  - ComprasHistory  │  │  - WeekGrid               │  │
│  │  - PriceTracker    │  │  - RecetaSelector         │  │
│  │  - FilterBar       │  │  - AutoGenerarLista       │  │
│  │  - GastoMensual    │  │  - CostEstimator          │  │
│  └───────────────────┘  └────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            GastosCompartidos                      │   │
│  │                                                    │   │
│  │  - RegistroGasto  - BalanceView  - AjusteForm     │   │
│  │  - CategoriaSelect - HistorialGastos              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Shared / Core                          │   │
│  │                                                    │   │
│  │  - SupabaseProvider  - BottomNav  - Layout        │   │
│  │  - useRealtime hook  - formatCurrency             │   │
│  │  - PWA manifest      - service-worker             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Decisiones Técnicas y Rationale

### 1. Next.js 15 App Router (no Pages Router)
- **Por qué**: App Router es el estándar actual, mejor soporte para Server Components y streaming.
- **Trade-off**: Más complejidad que Pages Router, pero más futuro.
- **Mobile-first**: Los Server Components reducen JS enviado al cliente → carga más rápida en 4G.

### 2. Supabase como BaaS (no backend propio)
- **Por qué**: Para 2 usuarios, un backend propio es overkill. Supabase da Auth + DB + Storage + Realtime gratis.
- **RLS como "backend"**: Las Row Level Security policies actúan como capa de autorización. No necesitamos middleware.
- **Realtime gratis**: Sync entre Vicente e Irene sin WebSocket server propio.

### 3. Gemini Flash via API Route (no directo desde cliente)
- **Por qué**: La API key de Gemini no puede ir al cliente. El API Route hace de proxy.
- **Flujo**: Móvil → captura foto → sube a Supabase Storage → API Route descarga foto → envía a Gemini → devuelve precio.
- **Alternativa descartada**: Enviar base64 directo desde cliente. Demasiado peso en la request.

### 4. PWA (no app nativa)
- **Por qué**: Un solo codebase, instalable, acceso a cámara via `getUserMedia`.
- **Limitación aceptada**: No hay push notifications ni offline. OK para MVP.
- **Cámara**: El Web API de cámara es suficiente para sacar fotos de precios.

### 5. Tailwind CSS (no component library)
- **Por qué**: Máxima velocidad de desarrollo, bundle mínimo, mobile-first utilities nativas.
- **Sin UI library**: shadcn/ui para componentes base si hace falta, pero empezamos solo con Tailwind.

### 6. Client-side Supabase SDK + Realtime
- **Por qué**: La app es interactiva. Las operaciones CRUD van directas desde el cliente a Supabase con el SDK JS.
- **Realtime subscriptions**: Para que cuando Irene edite el menú, Vicente lo vea al instante.
- **RLS protege**: No hay riesgo de que otro usuario acceda — solo 2 emails en whitelist.

### 7. Storage para fotos OCR
- **Por qué**: Guardar la foto original permite re-procesar si Gemini falla, y sirve como "recibo digital".
- **Bucket**: `ocr-photos`, políticas RLS para que solo los 2 usuarios suban/lean.
- **Cleanup**: Cron opcional para borrar fotos >30 días (no MVP).

### 8. Vercel Free Tier
- **Por qué**: Deploy automático desde GitHub, serverless functions para API Routes, edge network.
- **Límites free tier**: 100GB bandwidth, 100h serverless — más que suficiente para 2 usuarios.
