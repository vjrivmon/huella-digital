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
- Prefiere audios a texto en WhatsApp
- Hardware: Slimbook CREA15, Ryzen 7 8845HS, 64GB RAM, RTX 4070

## Proyectos activos
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
4. **TFG Chatbot RAG DNI** — Ensemble 4 LLMs, 94% precisión
5. **Zyndra/AidGuide** — Perro guía robótico, ROS2 + YOLOv8

## Infraestructura
- Auth: token Claude Max (anthropic:manual)
- SSH key en GitHub (visiclaw@openclaw)
- Whisper.cpp modelo small para STT en español
- No hay Brave API key configurada (web_search no funciona)

## Lecciones aprendidas
- Whisper medium (1.5GB) causa OOM en servidor 7.6GB — usar small
- Whisper.cpp no lee OGG directo — necesita wrapper ffmpeg→WAV
- Al hacer queries de familiar en Osyris, usar tanto `inscripciones_campamento.familiar_id` como `familiares_educandos` (puede haber IDs distintos)
- Siempre pushear todos los commits antes de decirle a Vicente que haga pull
- JSX condicional multilinea: SIEMPRE `{cond && (<Comp>...</Comp>)}` con paréntesis — sin ellos SWC da syntax error
- Tabla `configuracion_ronda` ya existía con cols diferentes (`fecha_creacion` no `created_at`, `nombre` NOT NULL). Siempre verificar schema existente antes de crear models
- Puppeteer funciona headless en servidor: `npm install puppeteer` en workspace, Chromium bundled. No necesita apt
- Para screenshots con login: API login primero → inyectar token+userData en localStorage (token, osyris_user, user, userRole)

## Baúl de Ideas (sistema automático)
- **Ubicación:** `workspace/baul-ideas/`
- **Captura:** Vicente envía `IDEA: descripción` por WhatsApp
- **Procesamiento:** Cron cada 2h (8,10,12,14,16,18,20,22 hora Madrid)
- **Fases:** Análisis → Diseño → Implementación → Entrega
- **Cron ID:** `9cc19946-5c39-4252-8d3f-0b1dd84f2970`
- Diseñado para descargar mental de Vicente — ideas se desarrollan solas
