# Plan de Implementación — App de Pus

## Estructura del Proyecto

```
app-de-pus/
├── docs/                          # Documentación (ya existe)
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── DOMAIN-MODEL.md
│   ├── USER-FLOWS.md
│   ├── DATABASE.md
│   └── IMPLEMENTATION-PLAN.md
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout + providers
│   │   ├── page.tsx               # Redirect a /compra
│   │   ├── login/
│   │   │   └── page.tsx           # Magic link login
│   │   ├── compra/
│   │   │   ├── page.tsx           # Lista activa o crear nueva
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx       # Editar lista (borrador)
│   │   │   │   └── comprar/
│   │   │   │       └── page.tsx   # Modo compra (pantalla principal F1)
│   │   │   └── historial/
│   │   │       ├── page.tsx       # Lista de compras pasadas
│   │   │       └── [id]/
│   │   │           └── page.tsx   # Detalle de compra
│   │   ├── menu/
│   │   │   ├── page.tsx           # Menú semana actual
│   │   │   └── recetas/
│   │   │       ├── page.tsx       # Lista de recetas
│   │   │       └── [id]/
│   │   │           └── page.tsx   # Editar receta
│   │   ├── gastos/
│   │   │   ├── page.tsx           # Balance + lista gastos
│   │   │   └── nuevo/
│   │   │       └── page.tsx       # Formulario nuevo gasto
│   │   └── api/
│   │       ├── ocr-price/
│   │       │   └── route.ts       # Proxy a Gemini Flash
│   │       ├── generate-lista/
│   │       │   └── route.ts       # Generar lista desde menú
│   │       └── estimate-cost/
│   │           └── route.ts       # Estimar coste de menú
│   ├── components/
│   │   ├── ui/                    # Componentes base (botones, inputs, cards)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── select.tsx
│   │   ├── layout/
│   │   │   ├── bottom-nav.tsx     # Navegación inferior (3 tabs)
│   │   │   ├── header.tsx
│   │   │   └── page-wrapper.tsx
│   │   ├── compra/
│   │   │   ├── lista-form.tsx     # Crear/editar lista
│   │   │   ├── producto-item.tsx  # Item en la lista
│   │   │   ├── producto-input.tsx # Input para añadir producto
│   │   │   ├── modo-compra.tsx    # Pantalla de compra activa
│   │   │   ├── presupuesto-bar.tsx # Barra de progreso
│   │   │   ├── camera-capture.tsx # Captura de foto
│   │   │   ├── precio-input.tsx   # Input numérico de precio
│   │   │   └── compra-resumen.tsx # Resumen post-compra
│   │   ├── historial/
│   │   │   ├── compras-list.tsx
│   │   │   ├── compra-detail.tsx
│   │   │   ├── filter-bar.tsx
│   │   │   └── price-trend.tsx
│   │   ├── menu/
│   │   │   ├── week-grid.tsx      # Grid 7×2
│   │   │   ├── menu-slot.tsx      # Slot individual
│   │   │   ├── receta-picker.tsx  # Selector de receta
│   │   │   ├── receta-form.tsx    # Crear/editar receta
│   │   │   └── lista-preview.tsx  # Preview lista generada
│   │   └── gastos/
│   │       ├── balance-card.tsx
│   │       ├── gasto-form.tsx
│   │       ├── gasto-item.tsx
│   │       ├── gastos-list.tsx
│   │       └── ajuste-form.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # createBrowserClient
│   │   │   ├── server.ts          # createServerClient
│   │   │   ├── middleware.ts      # Auth middleware
│   │   │   └── types.ts          # Database types (generado)
│   │   ├── gemini.ts              # Cliente Gemini Flash
│   │   ├── utils.ts               # formatCurrency, formatDate, etc.
│   │   └── constants.ts           # Categorías, supermercados, etc.
│   ├── hooks/
│   │   ├── use-realtime.ts        # Hook genérico para Supabase Realtime
│   │   ├── use-lista.ts           # CRUD lista + productos
│   │   ├── use-compras.ts         # Historial de compras
│   │   ├── use-menu.ts            # CRUD menú semanal
│   │   ├── use-recetas.ts         # CRUD recetas
│   │   ├── use-gastos.ts          # CRUD gastos + balance
│   │   └── use-camera.ts          # getUserMedia + captura
│   ├── providers/
│   │   └── supabase-provider.tsx  # Auth context + session
│   └── types/
│       └── index.ts               # TypeScript types del dominio
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker (básico)
│   ├── icons/                     # PWA icons (192, 512)
│   └── favicon.ico
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # Todo el schema de DATABASE.md
│   └── config.toml
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Fases de Implementación

### Phase 1: Setup — Infraestructura Base
**Estimación: 1-2 días**

| Tarea | Archivos | Dependencias |
|---|---|---|
| Crear proyecto Next.js 15 | `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` | — |
| Configurar Supabase | `supabase/config.toml`, `.env.local` | Cuenta Supabase |
| Ejecutar migrations | `supabase/migrations/001_initial_schema.sql` | Supabase project |
| Setup Auth (Magic Link) | `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` | — |
| Login page | `src/app/login/page.tsx` | Auth setup |
| Layout + providers | `src/app/layout.tsx`, `src/providers/supabase-provider.tsx` | Auth setup |
| Bottom navigation | `src/components/layout/bottom-nav.tsx`, `header.tsx` | Layout |
| PWA manifest | `public/manifest.json`, `public/sw.js`, iconos | — |
| UI components base | `src/components/ui/*.tsx` (button, input, card, etc.) | Tailwind |
| Generar DB types | `src/lib/supabase/types.ts` (supabase gen types) | Migrations |
| Domain types | `src/types/index.ts` | — |
| Deploy a Vercel | Configurar proyecto, env vars | Todo lo anterior |

**Entregable:** App desplegada con login funcional, navegación entre tabs vacías.

**Configuración clave `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=xxx
```

---

### Phase 2: F1 Compra Inteligente (Core)
**Estimación: 3-4 días**

**2A: Lista de compra (1-2 días)**

| Tarea | Archivos |
|---|---|
| Crear lista | `src/app/compra/page.tsx`, `src/components/compra/lista-form.tsx` |
| Añadir/editar productos | `src/components/compra/producto-input.tsx`, `producto-item.tsx` |
| Hook CRUD lista | `src/hooks/use-lista.ts` |
| Realtime sync | `src/hooks/use-realtime.ts` (compartir lista entre usuarios) |

**2B: Modo compra (1-2 días)**

| Tarea | Archivos |
|---|---|
| Pantalla modo compra | `src/app/compra/[id]/comprar/page.tsx`, `src/components/compra/modo-compra.tsx` |
| Barra presupuesto | `src/components/compra/presupuesto-bar.tsx` |
| Input precio manual | `src/components/compra/precio-input.tsx` |
| Check productos | Actualizar `producto-item.tsx` para modo compra |

**2C: OCR con cámara (1 día)**

| Tarea | Archivos |
|---|---|
| Captura cámara | `src/hooks/use-camera.ts`, `src/components/compra/camera-capture.tsx` |
| Upload a Storage | Dentro de `camera-capture.tsx` |
| API Route OCR | `src/app/api/ocr-price/route.ts` |
| Cliente Gemini | `src/lib/gemini.ts` |

**2D: Finalizar compra (0.5 días)**

| Tarea | Archivos |
|---|---|
| Lógica finalización | En `use-lista.ts`: crear Compra + CompraItems snapshot |
| Resumen compra | `src/components/compra/compra-resumen.tsx` |
| Transición estados | Borrador → en_compra → finalizada |

**Entregable:** Flujo completo F1: crear lista → ir al super → escanear precios → tracking presupuesto → finalizar.

---

### Phase 3: F2 Historial
**Estimación: 1-2 días**

| Tarea | Archivos |
|---|---|
| Lista de compras pasadas | `src/app/compra/historial/page.tsx`, `src/components/historial/compras-list.tsx` |
| Filtros (fecha, super) | `src/components/historial/filter-bar.tsx` |
| Detalle de compra | `src/app/compra/historial/[id]/page.tsx`, `src/components/historial/compra-detail.tsx` |
| Dashboard mensual | Widget en `compras-list.tsx`: total del mes |
| Hook historial | `src/hooks/use-compras.ts` |
| Tendencia de precios | `src/components/historial/price-trend.tsx` (chart simple) |

**Dependencias:** Phase 2 completada (necesita compras finalizadas para mostrar).

**Entregable:** Historial completo con filtros y tendencias.

---

### Phase 4: F3 Menú Semanal
**Estimación: 2-3 días**

**4A: CRUD Recetas (1 día)**

| Tarea | Archivos |
|---|---|
| Lista recetas | `src/app/menu/recetas/page.tsx` |
| Crear/editar receta | `src/app/menu/recetas/[id]/page.tsx`, `src/components/menu/receta-form.tsx` |
| Hook recetas | `src/hooks/use-recetas.ts` |

**4B: Menú semanal (1 día)**

| Tarea | Archivos |
|---|---|
| Grid semana | `src/app/menu/page.tsx`, `src/components/menu/week-grid.tsx` |
| Slot editable | `src/components/menu/menu-slot.tsx` |
| Picker de receta | `src/components/menu/receta-picker.tsx` |
| Hook menú | `src/hooks/use-menu.ts` |
| Realtime sync | Reutilizar `use-realtime.ts` |

**4C: Generar lista desde menú (0.5-1 día)**

| Tarea | Archivos |
|---|---|
| API generar lista | `src/app/api/generate-lista/route.ts` |
| API estimar coste | `src/app/api/estimate-cost/route.ts` |
| Preview lista | `src/components/menu/lista-preview.tsx` |
| Conectar con F1 | Crear ListaCompra desde preview → redirigir a /compra/[id] |

**Dependencias:** Phase 2 (para crear lista) + Phase 3 (para estimar costes).

**Entregable:** Menú semanal compartido con generación de lista y estimación.

---

### Phase 5: F4 Gastos Compartidos
**Estimación: 1-2 días**

| Tarea | Archivos |
|---|---|
| Balance card | `src/components/gastos/balance-card.tsx` |
| Lista gastos | `src/app/gastos/page.tsx`, `src/components/gastos/gastos-list.tsx` |
| Nuevo gasto | `src/app/gastos/nuevo/page.tsx`, `src/components/gastos/gasto-form.tsx` |
| Ajuste balance | `src/components/gastos/ajuste-form.tsx` |
| Item gasto | `src/components/gastos/gasto-item.tsx` |
| Hook gastos + balance | `src/hooks/use-gastos.ts` |
| Auto-gasto desde compra | En finalización F1: ofrecer crear gasto automático |
| Realtime sync | Reutilizar `use-realtime.ts` |

**Dependencias:** Phase 1 (auth, DB). Phase 2 opcional (link con compras).

**Entregable:** Gastos compartidos completo con balance.

---

## Resumen de Esfuerzo

| Fase | Feature | Estimación | Acumulado |
|---|---|---|---|
| 1 | Setup | 1-2 días | 1-2 días |
| 2 | F1 Compra Inteligente | 3-4 días | 4-6 días |
| 3 | F2 Historial | 1-2 días | 5-8 días |
| 4 | F3 Menú Semanal | 2-3 días | 7-11 días |
| 5 | F4 Gastos Compartidos | 1-2 días | 8-13 días |

**Total estimado: 8-13 días de desarrollo.**

---

## Dependencias entre Fases

```
Phase 1 (Setup)
    │
    ├──→ Phase 2 (F1 Compra) ──→ Phase 3 (F2 Historial)
    │         │                        │
    │         └──────────────┐         │
    │                        ▼         ▼
    │                   Phase 4 (F3 Menú) ← usa precios del historial
    │
    └──→ Phase 5 (F4 Gastos) ← puede empezar en paralelo con Phase 2
              ▲
              └── link opcional con compras finalizadas
```

---

## Notas de Implementación

### Mobile-First
- Tailwind breakpoints: diseñar para `sm` primero, luego `md`/`lg`
- Touch targets: mínimo 44×44px para botones
- Bottom nav fija: `fixed bottom-0` con `safe-area-inset-bottom`
- Teclado numérico: usar `inputmode="decimal"` para precios
- Cámara: `getUserMedia({ video: { facingMode: 'environment' } })`

### Performance
- Server Components para páginas estáticas (historial, recetas)
- Client Components para interactivas (modo compra, menú editable)
- `Suspense` boundaries para cargar datos incrementalmente
- Imágenes OCR: comprimir antes de subir (max 1MB), `sharp` en API Route si necesario

### PWA
- `next-pwa` o config manual de service worker
- Manifest con `display: standalone`, `theme_color` acorde al diseño
- Solo cache estático (no offline mode en MVP)
- Install prompt en primera visita

### Realtime
- Suscribirse solo a las tablas necesarias por pantalla
- Unsuscribirse al salir de la pantalla (cleanup en useEffect)
- Optimistic updates: actualizar UI antes de confirmar con Supabase

### Dinero
- **Siempre en céntimos** (integer) en DB y lógica
- Convertir a euros solo para display: `(amount / 100).toFixed(2)`
- Usar `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` para formatear
