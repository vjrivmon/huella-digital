# Huella Digital

> Descubre y gestiona tu presencia en internet. Ejerce tu derecho al olvido con un clic.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Descripcion

Huella Digital es una aplicacion web que te ayuda a:

- **Buscar tu huella digital** - Encuentra donde aparece tu informacion en internet
- **Detectar filtraciones** - Comprueba si tu email aparece en data breaches
- **Generar solicitudes GDPR** - Crea cartas legalmente validas para ejercer tus derechos
- **Hacer seguimiento** - Controla el estado de tus solicitudes de eliminacion

## Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Lucide Icons
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **APIs externas**: Google Custom Search API, Have I Been Pwned API

## Requisitos previos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de Supabase

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/vjrivmon/huella-digital.git
cd huella-digital
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Supabase (obligatorio)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Google Custom Search API (opcional, mejora resultados)
GOOGLE_SEARCH_API_KEY=tu-google-api-key
GOOGLE_SEARCH_ENGINE_ID=tu-search-engine-id

# Have I Been Pwned API (opcional, detecta filtraciones)
HIBP_API_KEY=tu-hibp-api-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`
3. Copia las credenciales a tu `.env.local`

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
huella-digital/
├── src/
│   ├── app/                    # App Router (paginas y rutas)
│   │   ├── (auth)/            # Rutas de autenticacion
│   │   ├── (dashboard)/       # Rutas protegidas del dashboard
│   │   └── api/               # API routes
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── layout/           # Componentes de layout
│   │   ├── search/           # Componentes de busqueda
│   │   └── gdpr/             # Componentes GDPR
│   ├── lib/                   # Utilidades y configuracion
│   │   └── supabase/         # Cliente Supabase
│   └── types/                 # Tipos TypeScript
├── supabase/
│   └── migrations/           # Migraciones SQL
└── public/                    # Assets estaticos
```

## Funcionalidades

### Busqueda de huella digital

- Busqueda por nombre, email y usernames
- Integracion con Google Custom Search API
- Deteccion de data breaches via Have I Been Pwned
- Clasificacion de resultados por severidad (critico, alto, medio, bajo)
- Clasificacion por categoria (redes sociales, foros, filtraciones, etc.)

### Generador de solicitudes GDPR

- Solicitudes de eliminacion (Art. 17)
- Solicitudes de acceso (Art. 15)
- Solicitudes de rectificacion (Art. 16)
- Solicitudes de portabilidad (Art. 20)
- Templates legalmente validos en espanol e ingles

### Tracker de solicitudes

- Estados: borrador, lista, enviada, completada, rechazada, escalada
- Recordatorios del plazo legal (30 dias GDPR)
- Opcion de escalar a la AEPD

### Otras funcionalidades

- Autenticacion con email/password
- Dark mode
- Exportacion de datos (GDPR Art. 20)
- Eliminacion de cuenta

## APIs Externas

### Google Custom Search API

Para obtener mejores resultados de busqueda:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita "Custom Search API"
3. Crea una API Key
4. Ve a [Programmable Search Engine](https://programmablesearchengine.google.com/)
5. Crea un motor de busqueda y obten el Search Engine ID

### Have I Been Pwned API

Para detectar filtraciones de datos:

1. Ve a [HIBP API](https://haveibeenpwned.com/API/Key)
2. Adquiere una API Key (requiere pago)
3. Configura la key en `.env.local`

## Despliegue

### Vercel (recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automatico

### Otros

La aplicacion es compatible con cualquier plataforma que soporte Next.js:
- Railway
- Fly.io
- Docker
- AWS Amplify

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Anade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para mas detalles.

## Autor

Creado por [vjrivmon](https://github.com/vjrivmon)

---

**Nota legal**: Esta herramienta facilita el ejercicio de derechos GDPR pero no constituye asesoramiento legal. Consulta con un abogado para casos especificos.
