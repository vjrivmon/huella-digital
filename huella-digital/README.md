# Huella Digital 🔒

> App para descubrir y gestionar tu huella digital en internet

Huella Digital te ayuda a encontrar dónde aparece tu información online y a ejercer tu derecho al olvido con solicitudes GDPR generadas automáticamente.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Características

- 🔍 **Búsqueda de huella digital** - Escanea múltiples fuentes (Google, Have I Been Pwned, redes sociales)
- 📊 **Dashboard intuitivo** - Visualiza y clasifica resultados por severidad
- 📝 **Generador GDPR** - Crea solicitudes legales de eliminación/acceso de datos
- 📋 **Tracker** - Haz seguimiento del estado de tus solicitudes
- 🔔 **Recordatorios** - Alertas automáticas de plazos legales (30 días GDPR)
- 🌍 **Multiidioma** - Español e Inglés

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Hono (API Routes) |
| Base de datos | Supabase (PostgreSQL + Auth + Storage) |
| Jobs | Inngest (background tasks) |
| Validación | Zod, React Hook Form |
| State | Zustand (si necesario) |

## 📁 Estructura del Proyecto

```
huella-digital/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rutas autenticadas
│   │   │   ├── dashboard/      # Panel principal
│   │   │   ├── results/        # Resultados de búsqueda
│   │   │   ├── gdpr/           # Generador de solicitudes
│   │   │   ├── tracker/        # Seguimiento de solicitudes
│   │   │   └── settings/       # Configuración de cuenta
│   │   ├── (marketing)/        # Rutas públicas
│   │   ├── api/                # API Routes (Hono)
│   │   ├── login/              # Página de login
│   │   └── register/           # Página de registro
│   ├── components/
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── forms/              # Componentes de formularios
│   │   ├── layout/             # Componentes de layout
│   │   ├── search/             # Componentes de búsqueda
│   │   ├── gdpr/               # Componentes GDPR
│   │   └── tracker/            # Componentes de tracking
│   ├── lib/
│   │   ├── supabase/           # Cliente Supabase
│   │   ├── hooks/              # Custom hooks
│   │   ├── validations/        # Esquemas Zod
│   │   └── utils.ts            # Utilidades
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Auth middleware
├── database/
│   ├── migrations/             # SQL migrations
│   └── seed/                   # Datos iniciales
├── packages/
│   └── jobs/                   # Inngest functions
└── public/                     # Assets estáticos
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Inngest](https://inngest.com) (opcional para dev)

### 1. Clonar el repositorio

```bash
git clone https://github.com/vjrivmon/huella-digital.git
cd huella-digital
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Supabase (obligatorio)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Inngest (para jobs en background)
INNGEST_EVENT_KEY=tu-event-key
INNGEST_SIGNING_KEY=tu-signing-key

# APIs externas (para funcionalidad de búsqueda)
GOOGLE_SEARCH_API_KEY=tu-api-key
GOOGLE_SEARCH_ENGINE_ID=tu-engine-id
HIBP_API_KEY=tu-hibp-key

# Email
RESEND_API_KEY=tu-resend-key
```

### 4. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://app.supabase.com)
2. Ve a SQL Editor y ejecuta los archivos en orden:
   - `database/migrations/001_initial_schema.sql`
   - `database/seed/001_templates.sql`
3. Copia las credenciales de API a tu `.env.local`

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) | ✅ |
| `INNGEST_EVENT_KEY` | Clave de eventos de Inngest | Para jobs |
| `INNGEST_SIGNING_KEY` | Clave de firma de Inngest | Para jobs |
| `GOOGLE_SEARCH_API_KEY` | API key de Google Custom Search | Para búsquedas |
| `GOOGLE_SEARCH_ENGINE_ID` | ID del motor de búsqueda | Para búsquedas |
| `HIBP_API_KEY` | API key de Have I Been Pwned | Para breaches |
| `RESEND_API_KEY` | API key de Resend | Para emails |

## 🧪 Desarrollo

### Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

### Estructura de la API

La API está construida con Hono y sigue REST:

```
GET    /api/health              # Health check
POST   /api/searches            # Crear búsqueda
GET    /api/searches            # Listar búsquedas
GET    /api/searches/:id        # Obtener búsqueda
GET    /api/searches/:id/results # Resultados de búsqueda
GET    /api/gdpr/templates      # Listar templates GDPR
POST   /api/gdpr/requests       # Crear solicitud GDPR
GET    /api/gdpr/requests       # Listar solicitudes
GET    /api/gdpr/requests/:id   # Obtener solicitud
PATCH  /api/gdpr/requests/:id   # Actualizar solicitud
GET    /api/user/profile        # Perfil de usuario
PATCH  /api/user/profile        # Actualizar perfil
```

## 📄 Licencia

MIT © [vjrivmon](https://github.com/vjrivmon)

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com) - Componentes de UI
- [Supabase](https://supabase.com) - Backend as a Service
- [Inngest](https://inngest.com) - Background jobs
- [Have I Been Pwned](https://haveibeenpwned.com) - API de breaches

---

**⚠️ Nota:** Este proyecto está en desarrollo activo. La funcionalidad de búsqueda real requiere configurar las APIs externas.
