# MEMORY.md — VisiClaw Long-Term Memory

## Quien soy
- **VisiClaw** 🧠 — colega técnico de Vicente
- Directo, técnico, con humor cuando toca
- Mi rol: aterrizar ideas y convertirlas en código

## Vicente
- AI Engineer, último año Tecnologías Interactivas UPV Gandía
- Especialización IA: Cátedra ENIA + VRAIN (UPV)
- 1er Puesto Nacional Telefónica Líderes Digitales 2025
- Monitor Scout en Grupo Scout Osyris (~100 miembros)
- Colaborador ONG "Damos Nuestra Ilusión" (DNI)
- Email: vicenterivas773@gmail.com | GitHub: vjrivmon
- Timezone: Europe/Madrid
- Canal principal: **Telegram** (desde marzo 2026, WhatsApp desactivado por petición de Vicente)
- Prefiere audios a texto (en WhatsApp usaba esto; pendiente ver preferencia en Telegram)
- Hardware: Slimbook CREA15, Ryzen 7 8845HS, 64GB RAM, RTX 4070

## Próximo Proyecto: Mission Control

**Estado:** Pendiente (después del 13 Feb)
**Objetivo:** App móvil/escritorio para comunicarse conmigo + agenda + planificador
**Stack:** Next.js + Supabase + PWA + WebSocket
**Referencia:** @pbteja1998 Mission Control

**Funcionalidades a diseñar:**
- [ ] Kanban board (Inbox → In Progress → Done)
- [ ] Chat conmigo en tiempo real
- [ ] Agenda y calendario
- [ ] Recordatorios y notificaciones
- [ ] Vista móvil y escritorio

**Arquitectura decidida:** Hexagonal (múltiples integraciones)

**Sistema Multi-Agente:**
- VisiClaw (Coordinador)
- Planner Agent (Tareas/Kanban)
- Calendar Agent (Google Calendar)
- GitHub Agent (Repos/Issues/PRs)
- Research Agent (Web search, papers)
- Writer Agent (TFG, docs, emails)

**Integraciones:**
- Google Calendar API
- GitHub API + Webhooks
- Supabase (DB, Auth, Realtime)
- Firebase Cloud Messaging (Push)
- OpenClaw Gateway (WebSocket)

---

## Proyectos activos

0. **TFG-GTI-2026** — 📚 Repositorio principal del TFG (TODO lo del TFG va aquí)
   - Repo: github.com/vjrivmon/TFG-GTI-2026 (privado)
   - Local: `/root/.openclaw/workspace/TFG-GTI-2026/`
   - Contiene: LaTeX, skills, apuntes, referencias (Joan, Rosa), rúbricas UPV
   - **IMPORTANTE**: Cualquier trabajo de TFG → este repo

1. **Osyris-Web** — Plataforma scout, Next.js 15 + Express.js + PostgreSQL + Google Drive
   - Producción: https://gruposcoutosyris.es
   - ~100 familias activas, 80% reducción admin
2. **Setup-Software-IA** — Framework Design-First con 667 skills y 13 agentes
   - Skill: `mobile-first-ui-library` (iOS HIG, componentes, navegación PWA)
   - Skill: `design-consistency` (tokens de colores, tipografía, checklist)
   - Comandos: `/design:mobile-ui`, `/design:consistency`
3. **App de Pus (App Gestión Familiar)** — MVP Phase 2 completada
   - Compra inteligente + Menú semanal + Finanzas de pareja
   - Stack: Next.js 15 + Supabase + Tailwind + Recharts + Gemini Flash (OCR)
   - Supabase URL: areozxxftwktirkgjppu.supabase.co
   - Repo: github.com/vjrivmon/app-gestion-familiar
   - Phase 2 completada: 8 sprints, ~70 archivos, ~13K líneas
   - Features: Ingresos, Gastos, Balance, Patrimonio, Conjunta, Transferencias, Becas, Préstamos, Metas, Calculadora Piso, Tareas Hogar, Gráficos, Export JSON
   - Pendiente: Phase 3 (Compra Inteligente + Menú Semanal)
4. **TFG Chatbot RAG DNI v4** — Arquitectura Híbrida (Hexagonal + Multi-Agent)
   - Benchmark semántico: **95/100 (95%)** 🎉 (similitud 85.2%, confianza 67.2%)
   - Config: chunk_size=400, overlap=100, top_k=8, gemma2:27b (UPV Ollama)
   - El benchmark de keywords (81%) subestimaba; evaluación semántica es la correcta
   - Solo 5 fallos reales: 4 "no info" + 1 baja similitud
   - **Código**: github.com/vjrivmon/chatbot-dni-v4 (hexagonal) + rag_optimizer (original)
   - **Documentación TFG**: github.com/vjrivmon/TFG-GTI-2026 ← TODO aquí
   - **IMPORTANTE - Modelo final**: Gemma 2 27B en servidor UPV (VRAIN), NO local
   - **NO usa ensemble/multimodelo** - Se probó pero descartó por recursos limitados (ONG)
   - Benchmark de 4 modelos (~60 preguntas): DeepSeek, Gemma, Qwen, + otro → Gemma ganó
   - Ensemble descartado: Gemma solo = mismo rendimiento que ensemble, más fácil de mantener
5. **Zyndra/AidGuide** — Perro guía robótico, ROS2 + YOLOv8

## Infraestructura
- Auth: token Claude Max (anthropic:manual)
- SSH key en GitHub (visiclaw@openclaw)
- Whisper.cpp modelo small para STT en español
- No hay Brave API key configurada (web_search no funciona)

## Perfil Psicológico (de sesiones de coaching)

### Fortalezas
- "Generalista profundo": frontend, backend, DevOps, IA, hardware, robótica
- Diferenciador: skills técnicas + propósito social + filosofía local-first
- Capacidad de crear caminos, no depender de uno solo

### Puntos de mejora
1. **Dispersión** por exceso de intereses → Definir 2-3 tecnologías núcleo
2. **Alta autoexigencia** sin métricas claras → Dashboard de logros tangibles
3. **Impulsividad** en decisiones → Regla de 24h para no reversibles
4. **Maldición del conocimiento** → Empezar por donde está el otro
5. **Ahorro** → Necesita mejores bases

### Sistemas que funcionan para él
1. Bandeja de Entrada → Filtro Semanal → Foco Diario
2. Cuaderno Físico de "Pruebas de Capacidad"
3. Regla de 24 Horas

### Obsesión
- **Productiva (flow)**: perderse en problema, salir con algo tangible ← Superpoder
- **Destructiva (rumiación)**: dar vueltas sin avanzar ← Evitar
- Pregunta clave: "¿Estoy avanzando o solo dando vueltas?"

### Plan de carrera
- MUITSS → Investigación → PhD (preferido)
- Backup: Consultoría IA aplicada / I+D empresas
- Becas a buscar: CIACIF, Santiago Grisolía, FPU, FPI

### Principio central
> "No estás construyendo UN camino. Estás construyendo capacidad de crear caminos."

---

## Preferencias de trabajo

### Diseño UI
**NO EMOJIS** — Vicente no quiere emojis en ningún diseño. Usar iconos SVG o texto.

### UI/UX Obligatorio

### UI/UX Obligatorio
**SIEMPRE** consultar decisiones de UI/UX con los agentes del framework Setup-Software-IA:
- `ux-expert` — para decisiones de experiencia de usuario
- `ui-ux` — para diseño visual y componentes
Las leyes de UX deben cumplirse al pie de la letra. Soluciones profesionales.

### Diseño riguroso antes de código
Para cualquier MVP/proyecto nuevo:
1. Investigar TODOS los edge cases
2. Diseñar historias de usuario completas
3. Crear diagramas C4 (contexto, contenedores, componentes)
4. Mapa de usuario (user journey)
5. Considerar TODOS los tipos de usuarios posibles
6. Validar usabilidad antes de implementar

Vicente está estudiando arquitecturas multiagente (libro: "Building Applications with AI Agents") para definir la mejor arquitectura según caso de uso.

## App Encesa (Fallas Valencia 2026)
- **Live:** https://vjrivmon.github.io/encesa/ | Repo: vjrivmon/encesa
- **Supabase:** zvljpppcdbawicamhbix.supabase.co | anon key en app/.env.local
- **Deploy:** `git checkout gh-pages && cp -r app/dist/* . && git add -A && git commit && git push origin gh-pages --force`
- iOS PWA y Safari tienen IndexedDB aislados — service worker muy testarudo, hay que eliminar+reinstalar PWA
- `fetch('data:...')` no funciona en Safari iOS → usar `atob()` directo
- Twitter bloquea CORS con Sec-Fetch-Mode:cors → proxy server-side necesario
- fxtwitter API (`api.fxtwitter.com/status/{id}`) devuelve video URLs con CORS abierto
- TikTok: tikwm API (`www.tikwm.com/api/?url=`) devuelve video URLs
- Proxy: `/tmp/video-proxy.mjs` puerto 3099 + systemd `encesa-proxy` + `encesa-tunnel`
- URL fija tunnel: `https://encesa-fallas.loca.lt` (loca.lt cierra cada ~15min, systemd reinicia)
- URL dinámica en `proxy-config.json` en gh-pages (no rebuild al cambiar)
- iOS OOM: nunca renderizar >50 cards de golpe ni hacer 703 IndexedDB writes al startup
- pullFromSupabase NO en startup (OOM) — solo manual vía botón "Actualizar desde nube"
- Fórmula completitud Encesa: fotos(50%) + valoración(35%) + notas(15%)

## Lecciones aprendidas
- Whisper medium (1.5GB) causa OOM en servidor 7.6GB — usar small
- Whisper.cpp no lee OGG directo — necesita wrapper ffmpeg→WAV
- Al hacer queries de familiar en Osyris, usar tanto `inscripciones_campamento.familiar_id` como `familiares_educandos` (puede haber IDs distintos)
- Siempre pushear todos los commits antes de decirle a Vicente que haga pull
- JSX condicional multilinea: SIEMPRE `{cond && (<Comp>...</Comp>)}` con paréntesis — sin ellos SWC da syntax error
- Tabla `configuracion_ronda` ya existía con cols diferentes (`fecha_creacion` no `created_at`, `nombre` NOT NULL). Siempre verificar schema existente antes de crear models
- Puppeteer funciona headless en servidor: `npm install puppeteer` en workspace, Chromium bundled. No necesita apt
- Para screenshots con login: API login primero → inyectar token+userData en localStorage (token, osyris_user, user, userRole)

## Sistema Multi-Agente (Feb 2026)

**Estructura:**
```
workspace/
├── agents/
│   ├── researcher/SOUL.md    # Papers, repos, noticias tech
│   └── tfg-writer/SOUL.md    # Asistente TFG específico
└── intel/
    └── DAILY-INTEL.md        # Output del Researcher
```

**Cron Jobs:**
- `Researcher Morning Scan` — 08:00 Madrid (07:00 UTC) — arXiv, GitHub, HN
- `TFG-Writer Daily Check` — 09:00 Madrid (08:00 UTC) — Estado TFG, micro-tareas

**Próximos agentes (cuando estos funcionen):**
- CodeReviewer — PRs y commits de repos activos
- Scout-Admin — Circulares y gestión Osyris

**Inspiración:** Setup de Shubham (6 agentes coordinados via archivos)

---

## Proyecto Tesis — Detección Prematura Autismo en Mujeres

**Estado:** Idea en fase de investigación (base para propuesta doctoral)
**Motivación personal:** Irene (pareja de Vicente) diagnosticada con autismo nivel 1 a los 21 años — diagnóstico tardío evitable.
**Objetivo:** Herramienta/sistema usable para detección prematura de TEA en mujeres, útil para clínicos, padres y la propia persona.
**Tutor consultado:** Juanmi (cree que hay potencial, falta definir bases)
**Camino previsto:** Paper inicial → sistema → validación clínica → tesis doctoral

**Acciones tomadas (02/03/2026):**
- VisiResearch Morning Scan actualizado: incluye búsquedas diarias sobre autismo+mujeres+IA
- Sub-agente lanzado para estado del arte completo (cron ID: autism-research-sota)

**Por hacer:**
- Recibir informe del estado del arte del sub-agente
- Identificar gap real y formular propuesta concreta
- Conectar con profesionales del sector (neurólogos, psicólogos, investigadores TEA)
- Definir dataset de partida (ABIDE, SPARK, etc.)

---

## Baúl de Ideas (sistema automático)
- **Ubicación:** `workspace/baul-ideas/`
- **Captura:** Vicente envía `IDEA: descripción` por WhatsApp
- **Procesamiento:** Cron cada 2h (8,10,12,14,16,18,20,22 hora Madrid)
- **Fases:** Análisis → Diseño → Implementación → Entrega
- **Cron ID:** `9cc19946-5c39-4252-8d3f-0b1dd84f2970`
- Diseñado para descargar mental de Vicente — ideas se desarrollan solas
