# Sistema Baúl de Ideas

## Flujo de Procesamiento

### 1. Captura de Ideas
Cuando Vicente envía un mensaje con `IDEA:` o `idea:`:
1. Parsear el texto después de "IDEA:"
2. Añadir a IDEAS.md en sección "Pendientes" con formato:
   ```
   ### [FECHA] Nombre corto
   - **Estado:** pendiente
   - **Descripción:** La idea completa
   - **Prioridad:** normal
   - **Creado:** YYYY-MM-DD HH:MM
   ```

### 2. Procesamiento (cada 2-3h via cron)
Para cada idea pendiente:

**Fase 1: Análisis (30 min)**
- Crear carpeta `baul-ideas/ideas/[slug]/`
- Generar SPEC.md con:
  - Problema que resuelve
  - Usuario objetivo
  - Features mínimas (MVP)
  - Stack recomendado
- Mover idea a "En Progreso"

**Fase 2: Diseño (siguiente ciclo)**
- Generar ARCHITECTURE.md:
  - Estructura de carpetas
  - Modelos de datos
  - APIs necesarias
  - Flujos principales

**Fase 3: Implementación (siguiente ciclo)**
- Crear repo en GitHub: `vjrivmon/[nombre-repo]`
- Setup inicial (Next.js / Python / lo que corresponda)
- Implementar features en branches
- Tests básicos

**Fase 4: Entrega (siguiente ciclo)**
- Merge a main
- README completo
- Notificar a Vicente
- Mover a "Completadas"

### 3. Priorización
- **alta** — procesar en el siguiente ciclo
- **normal** — procesar cuando no haya altas
- **baja** — procesar cuando no haya otras

### 4. Límites
- Máximo 1 idea en progreso a la vez
- Máximo 3 ideas pendientes (cola)
- Si hay más, Vicente decide cuál descartar

## Comandos
- `IDEA: [descripción]` — Nueva idea
- `IDEA ALTA: [descripción]` — Idea prioritaria
- `IDEAS` — Ver estado del baúl
- `PAUSAR [nombre]` — Pausar desarrollo de una idea
- `CANCELAR [nombre]` — Cancelar idea

## Ejemplo de ciclo

```
08:00 - Vicente: "IDEA: App para trackear hábitos con gamificación"
08:05 - VisiClaw: "Idea capturada. La procesaré en el siguiente ciclo."

10:00 - Cron ejecuta procesamiento
      - Fase 1: Análisis → genera SPEC.md
      - Notifica: "Fase 1 completada para 'Habit Tracker'"

12:00 - Cron ejecuta
      - Fase 2: Diseño → genera ARCHITECTURE.md
      
14:00 - Cron ejecuta
      - Fase 3: Implementación → crea repo, código base

16:00 - Cron ejecuta
      - Fase 3 continúa → features principales

18:00 - Cron ejecuta
      - Fase 4: Entrega → merge, docs, notificación

18:05 - VisiClaw: "Tu idea 'Habit Tracker' está lista: github.com/vjrivmon/habit-tracker"
```
