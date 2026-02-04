# Huella Digital - Especificación Técnica

> App que ayuda a descubrir y gestionar tu presencia en internet, facilitando el ejercicio del derecho al olvido.

**Estado:** Análisis completado  
**Fecha:** 2026-02-04  
**Última actualización:** 2026-02-04

---

## 1. Problema que Resuelve

### El problema central

Las personas **no tienen visibilidad ni control** sobre su información personal en internet:

1. **Dispersión de datos** — Tu información está esparcida en decenas de sitios: redes sociales antiguas, foros, bases de datos de brokers, registros públicos, filtraciones de datos, comentarios, perfiles abandonados.

2. **Falta de awareness** — La mayoría no sabe dónde publicó qué, ni qué información suya circula sin su conocimiento.

3. **Complejidad para eliminar** — Aunque existe el derecho al olvido (GDPR Art. 17), ejercerlo requiere:
   - Identificar todos los lugares donde están tus datos
   - Conocer los procedimientos de cada plataforma
   - Redactar solicitudes legalmente válidas
   - Hacer seguimiento de cada solicitud
   - Escalar a autoridades si no responden

4. **Consecuencias reales**:
   - Reputación dañada por contenido antiguo
   - Empleadores que encuentran información embarazosa
   - Acoso facilitado por datos públicos
   - Robo de identidad con información agregada
   - Ansiedad por falta de control sobre tu imagen pública

### Escenarios de uso

- **Búsqueda de empleo** — Limpiar presencia online antes de postular
- **Post-ruptura** — Eliminar fotos/contenido de relaciones pasadas
- **Arrepentimiento** — Borrar publicaciones de juventud
- **Seguridad personal** — Reducir exposición a acosadores
- **Profesionalización** — Transición de perfil personal a profesional
- **Filtraciones** — Saber si tus datos aparecieron en data breaches

---

## 2. Usuario Objetivo

### Persona principal: María (32 años, profesional)

**Demografía:**
- 28-45 años
- Profesional con carrera activa
- Nivel técnico: medio (usa apps, pero no es developer)
- Ubicación: España/LATAM/UE (jurisdicción GDPR)

**Situación:**
- Tiene cuentas abandonadas en redes sociales de hace 10+ años
- Publicó cosas de joven que ahora le avergüenzan
- Está en proceso de búsqueda de empleo o ascenso
- Sabe que "debería" limpiar su presencia online pero no sabe cómo

**Frustraciones:**
- "No tengo tiempo para buscar en 50 sitios diferentes"
- "No sé ni por dónde empezar"
- "¿Qué digo en el email para que lo borren?"
- "Me da ansiedad no saber qué hay sobre mí"

**Necesidades:**
- Visibilidad: saber qué hay sobre mí
- Priorización: qué es urgente vs menor
- Acción: poder hacer algo concreto
- Seguimiento: saber si funcionó

### Personas secundarias

**Carlos (45, ejecutivo):**
- Mayor poder adquisitivo
- Disposición a pagar por servicio premium
- Preocupado por reputación profesional

**Ana (22, recién graduada):**
- Nativa digital con MUCHA presencia
- Poco dinero pero mucho tiempo
- Quiere control antes de entrar al mercado laboral

**Pedro (55, padre preocupado):**
- Quiere proteger a sus hijos menores
- Busca herramienta para monitorear/limpiar
- Menos technical pero muy motivado

---

## 3. Features MVP (Mínimas Viables)

### 3.1 Core Features (Imprescindibles)

#### F1: Búsqueda de huella digital
- Input: nombre completo, email(s), username(s)
- Búsqueda en Google (via API o scraping controlado)
- Búsqueda en Have I Been Pwned (API pública)
- Búsqueda en redes sociales principales (username search)
- Output: lista de resultados con URL, tipo, fecha (si disponible), preview

#### F2: Dashboard de resultados
- Visualización organizada por categoría:
  - Redes sociales
  - Foros/comentarios
  - Noticias/menciones
  - Data breaches
  - Otros
- Indicador de severidad/prioridad
- Filtros y ordenamiento

#### F3: Generador de solicitudes GDPR
- Templates legalmente correctos en español/inglés
- Personalización automática con datos del usuario
- Diferentes tipos:
  - Solicitud de eliminación (Art. 17)
  - Solicitud de acceso (Art. 15)
  - Solicitud de rectificación (Art. 16)
- Exportación como PDF/email listo para enviar
- Direcciones de contacto DPO de plataformas principales

#### F4: Tracking de solicitudes
- Estado de cada solicitud: pendiente, enviada, respondida, resuelta
- Recordatorios automáticos (GDPR da 30 días para responder)
- Plantilla de escalamiento a autoridad de control

### 3.2 Nice-to-have (v1.1+)

- Monitoreo continuo (alertas cuando aparece nueva info)
- Integración con APIs de redes sociales para eliminación directa
- Score de "exposición digital"
- Recomendaciones de privacidad personalizadas
- Guía de eliminación paso a paso para cada plataforma
- Modo "incógnito" para búsqueda sin dejar rastro

---

## 4. Stack Técnico Recomendado

### 4.1 Frontend

```
Framework: Next.js 14 (App Router)
Styling: Tailwind CSS + shadcn/ui
State: Zustand o Context (simple)
Forms: React Hook Form + Zod
```

**Justificación:**
- SSR para SEO (landing importa para este tipo de producto)
- shadcn para UI profesional rápida
- Zod para validación robusta de inputs sensibles

### 4.2 Backend

```
Runtime: Node.js (Bun o Node 20+)
Framework: Hono o Express
Database: PostgreSQL (Supabase)
Auth: Supabase Auth o Clerk
Queue: BullMQ + Redis (para búsquedas async)
```

**Justificación:**
- PostgreSQL para datos estructurados y búsquedas complejas
- Queue necesaria porque las búsquedas son lentas
- Auth robusto por la sensibilidad de los datos

### 4.3 Servicios externos

```
- Google Custom Search API ($5/1000 queries)
- Have I Been Pwned API (gratis con rate limits)
- Proxy rotativo para búsquedas (Bright Data, ~$15/GB)
- Email: Resend o SendGrid (para enviar solicitudes)
- PDF generation: @react-pdf/renderer o Puppeteer
```

### 4.4 Infraestructura

```
Hosting: Vercel (frontend) + Railway/Fly.io (backend)
Database: Supabase (incluye auth)
Storage: Supabase Storage (para PDFs generados)
Monitoring: Sentry + Posthog
```

### 4.5 Arquitectura simplificada

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Landing  │  │ Dashboard│  │Generator │  │ Tracker │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────┬───────────────────────────────┘
                          │ API
┌─────────────────────────┴───────────────────────────────┐
│                    Backend (Hono/Node)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Search   │  │ GDPR Gen │  │ Tracking │              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └────┬─────┘  └──────────┘  └──────────┘              │
│       │                                                  │
│  ┌────┴─────────────────────────────────┐               │
│  │         Job Queue (BullMQ)           │               │
│  └──────────────────────────────────────┘               │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│  PostgreSQL │ Redis │ External APIs (Google, HIBP...)   │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Consideraciones Legales (GDPR)

### 5.1 Marco legal aplicable

**GDPR (Reglamento General de Protección de Datos)**

Artículos clave:
- **Art. 15** — Derecho de acceso: el usuario puede solicitar qué datos tienen sobre él
- **Art. 16** — Derecho de rectificación: corregir datos incorrectos
- **Art. 17** — Derecho de supresión ("derecho al olvido")
- **Art. 20** — Derecho a portabilidad de datos

**Límites del derecho al olvido (Art. 17.3):**
- Libertad de expresión e información
- Cumplimiento de obligación legal
- Razones de interés público (salud, archivos, investigación)
- Ejercicio de reclamaciones legales

### 5.2 Nuestra app como responsable de tratamiento

**Nosotros también debemos cumplir GDPR:**

1. **Base legal para procesar datos**
   - Consentimiento explícito del usuario
   - Ejecución de contrato (el servicio que proporcionamos)

2. **Obligaciones**
   - Política de privacidad clara y completa
   - Registro de actividades de tratamiento
   - Medidas de seguridad apropiadas
   - DPO si procesamos datos a gran escala
   - Notificación de brechas en 72h

3. **Derechos del usuario sobre sus datos EN NUESTRA APP**
   - Exportar todos sus datos
   - Eliminar su cuenta completamente
   - Saber qué datos guardamos

### 5.3 Riesgos legales específicos

| Riesgo | Nivel | Mitigación |
|--------|-------|------------|
| Scraping de sitios con ToS que lo prohíben | Alto | Usar APIs oficiales donde existan; términos claros |
| Almacenar datos personales de terceros | Alto | Solo almacenar lo mínimo, cifrado, purga automática |
| Generar solicitudes incorrectas | Medio | Disclaimer claro, revisar con abogado |
| Usuario usa el servicio para acosar | Medio | Verificar que busca su propia información |
| Data breach de nuestra base de datos | Alto | Cifrado, mínimo almacenamiento, auditorías |

### 5.4 Recomendaciones

1. **Consultar con abogado especializado en privacidad** antes de lanzar
2. **No almacenar resultados de búsqueda** más de lo necesario (7-30 días max)
3. **Cifrar todo** en reposo y en tránsito
4. **Verificación de identidad** light (email) para evitar que busquen datos de otros
5. **Términos de servicio claros** sobre responsabilidad de las solicitudes generadas

---

## 6. Fuentes de Datos Posibles

### 6.1 APIs oficiales (recomendadas)

| Fuente | API | Costo | Datos |
|--------|-----|-------|-------|
| **Google** | Custom Search JSON API | $5/1000 queries | Resultados de búsqueda |
| **Have I Been Pwned** | Public API | Gratis (rate limited) | Data breaches |
| **Hunter.io** | Email API | Freemium | Emails asociados a nombre |
| **Clearbit** | Person API | $99+/mes | Datos profesionales |
| **FullContact** | Person API | Freemium | Agregación de perfiles |

### 6.2 Búsqueda en redes sociales

| Red | Método | Viabilidad |
|-----|--------|------------|
| **LinkedIn** | No API pública, scraping difícil | ⚠️ Complejo |
| **Twitter/X** | API oficial (cara) | ✅ Posible |
| **Facebook** | No API pública | ❌ Casi imposible |
| **Instagram** | No API para búsqueda | ❌ Muy difícil |
| **TikTok** | No API pública | ❌ Difícil |
| **Reddit** | API oficial (gratis limitada) | ✅ Posible |
| **GitHub** | API oficial | ✅ Fácil |

### 6.3 Otras fuentes

- **Whois** — Dominios registrados a tu nombre
- **Archive.org** — Versiones antiguas de páginas
- **Registro público de empresas** — Si eres administrador/socio
- **BOE/registros oficiales** — Publicaciones legales (herencias, etc.)
- **Periódicos locales** — Menciones en prensa

### 6.4 Estrategia recomendada para MVP

```
Fase 1 (MVP):
├── Google Custom Search (principal)
├── Have I Been Pwned (breaches)
├── Username enumeration básico (GitHub, Reddit, Twitter)
└── Whois lookup

Fase 2 (v1.1):
├── Integración con más APIs de personas
├── Alertas de monitoreo continuo
└── Búsqueda en Archive.org

Fase 3 (v2.0):
├── Scraping controlado con proxies
├── ML para relevancia de resultados
└── Partnerships con data brokers para eliminación directa
```

---

## 7. Limitaciones Técnicas y Éticas

### 7.1 Limitaciones técnicas

1. **Google no indexa todo**
   - Deep web, contenido privado, paywalls
   - Solución parcial: múltiples fuentes

2. **Rate limits de APIs**
   - HIBP: 1 request/1.5s
   - Google: 100 queries/día gratis
   - Solución: queues, caching, planes premium

3. **Información efímera**
   - Stories, posts eliminados, etc.
   - No hay forma técnica de recuperar

4. **Cambio de políticas**
   - APIs pueden cerrar/cambiar (ej: Twitter)
   - Solución: arquitectura modular

5. **Falsos positivos**
   - "Juan García" en Madrid → miles de resultados
   - Solución: más datos de input, ML para filtrar

### 7.2 Limitaciones éticas

1. **Solo tu propia información**
   - El servicio NO debe usarse para investigar a otros
   - Verificación de que el usuario busca sus propios datos
   - Problema: ¿cómo verificar identidad sin ser invasivos?

2. **No facilitar acoso**
   - Agregar información puede facilitar stalking
   - Mitigación: no mostrar direcciones físicas, teléfonos

3. **Sesgo en resultados**
   - Nombres comunes tienen más falsos positivos
   - Disclosure claro sobre limitaciones

4. **Expectativas realistas**
   - No podemos garantizar eliminación
   - Las plataformas pueden negarse legalmente
   - Algunos datos son imposibles de eliminar (Wayback Machine, copias)

### 7.3 Consideraciones adicionales

**Lo que NO haremos:**

- ❌ Hackear o acceder a sistemas sin autorización
- ❌ Usar credenciales del usuario para entrar a sus cuentas
- ❌ Scraping masivo que viole ToS
- ❌ Almacenar datos sensibles sin cifrado
- ❌ Vender o compartir datos de usuarios

**Lo que SÍ haremos:**

- ✅ Usar APIs públicas y legales
- ✅ Ser transparentes sobre limitaciones
- ✅ Cifrar todo
- ✅ Dar control total al usuario sobre sus datos
- ✅ Purgar datos regularmente

---

## 8. Estimación de Complejidad

### 8.1 Matriz de complejidad

| Componente | Complejidad | Justificación |
|------------|-------------|---------------|
| Landing + Auth | 🟢 Baja | Standard, muchos templates |
| Búsqueda Google API | 🟢 Baja | API bien documentada |
| Búsqueda HIBP | 🟢 Baja | API simple y gratuita |
| Dashboard de resultados | 🟡 Media | UI compleja, muchos estados |
| Username enumeration | 🟡 Media | Múltiples fuentes, rate limits |
| Generador GDPR | 🟡 Media | Templates + personalización |
| Tracking de solicitudes | 🟡 Media | CRUD + recordatorios |
| Sistema de colas | 🟡 Media | Búsquedas async, reintentos |
| Verificación de identidad | 🟠 Alta | Balance seguridad/fricción |
| Cumplimiento legal propio | 🟠 Alta | Requiere abogado, auditorías |

### 8.2 Estimación de tiempos

**MVP completo: 6-8 semanas** (1 developer full-time)

```
Semana 1-2:
├── Setup proyecto (Next.js, Supabase, Hono)
├── Auth y modelo de datos
├── Landing page básica
└── Integración Google Search API

Semana 3-4:
├── Dashboard de resultados
├── Integración HIBP
├── Username enumeration básico
└── Sistema de colas (BullMQ)

Semana 5-6:
├── Generador de solicitudes GDPR
├── Templates legales (con revisión)
├── Tracker de solicitudes
└── Notificaciones/recordatorios

Semana 7-8:
├── Testing e2e
├── Revisión de seguridad
├── Documentación legal (privacidad, ToS)
└── Deploy y soft launch
```

### 8.3 Costes estimados (mensual, post-MVP)

| Concepto | Coste/mes |
|----------|-----------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Railway/Fly.io | $10-20 |
| Google Search API (5k queries) | $25 |
| Dominio | ~$1 |
| **Total mínimo** | **~$80/mes** |

Con escala (1000 usuarios activos):
- Google Search API: ~$150/mes
- Infra escalada: ~$100/mes
- Servicios adicionales: ~$50/mes
- **Total**: ~$300/mes

### 8.4 Riesgos principales

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| APIs cambian/cierran | Media | Alto | Arquitectura modular, múltiples fuentes |
| Problemas legales | Baja | Muy Alto | Consulta legal previa, disclaimers |
| Costes de API escalan | Media | Medio | Caching agresivo, rate limiting por usuario |
| Competencia fuerte | Media | Medio | Enfoque en UX y mercado hispanohablante |
| Baja adopción | Media | Alto | Validar con usuarios antes de construir |

---

## 9. Competencia y Diferenciación

### Competidores existentes

| Producto | Mercado | Precio | Fortaleza | Debilidad |
|----------|---------|--------|-----------|-----------|
| **DeleteMe** | USA | $129/año | Eliminación activa | Solo USA, caro |
| **Kanary** | USA | $89/año | Data brokers | Solo USA |
| **Deseat.me** | Global | Gratis | Encuentra cuentas | No elimina |
| **JustDeleteMe** | Global | Gratis | Directorio de eliminación | No busca por ti |
| **Mine** | Global | Freemium | Mapeo de datos | Limitado |

### Nuestra diferenciación

1. **Enfoque en español/LATAM** — Mercado desatendido
2. **Especialización en GDPR** — Templates legales adaptados
3. **Freemium accesible** — Búsqueda gratis, premium para extras
4. **No solo data brokers** — También redes sociales, foros, etc.
5. **Educativo** — Explicamos qué es cada cosa y por qué importa

---

## 10. Próximos Pasos

1. ✅ Análisis completado (este documento)
2. ⬜ Validar con 5-10 usuarios potenciales
3. ⬜ Consulta legal básica
4. ⬜ Diseño de UI/UX (wireframes)
5. ⬜ Implementación MVP

---

*Documento generado por VisiClaw — 2026-02-04*
