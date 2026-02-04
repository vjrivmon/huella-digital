---
name: mvp-mode
description: >
  Genera MVPs completos desde una conversación por chat. Se activa cuando el usuario
  menciona "MVP" en el mensaje. Replica el flujo de Setup-Software-IA (entrevista →
  diseño → arquitectura → implementación → tests → delivery) pero de forma conversacional,
  haciendo las preguntas por chat en lugar de por terminal. Tests, UX/UI y ejecución
  corren por cuenta del agente. El usuario solo participa en decisiones de producto y
  arquitectura. Al finalizar, se crea el repo en GitHub y se sube todo.
---

# MVP Mode — Flujo Conversacional

Generar MVPs completos mediante conversación. Basado en el framework Setup-Software-IA
de Vicente (13 agentes, 651 skills, Design-First).

## Activación

Se activa cuando el usuario menciona **"MVP"** en el chat. Responder:

> "🧠 Modo MVP activado. Empecemos. ¿Cómo se llama el proyecto?"

## Fases

### Fase 0: Kickoff (1-2 mensajes)
- Nombre del proyecto
- Pitch en una frase ("¿Qué problema resuelve?")
- Crear directorio de trabajo: `workspace/mvps/{nombre}/`

### Fase 1: Entrevista (8-15 preguntas)

Replicar el spec-interviewer. Hacer preguntas en bloques de 2-3 para no saturar.

**Bloque A — Problema y usuarios:**
- ¿Qué problema resuelve?
- ¿Quiénes son los usuarios? (roles)
- ¿Cómo lo resuelven ahora? (alternativas actuales)

**Bloque B — Features core:**
- ¿Cuáles son las 3-5 funcionalidades imprescindibles del MVP?
- ¿Qué NO entra en el MVP? (scope cut)
- ¿Hay integraciones externas? (APIs, pagos, auth)

**Bloque C — Técnico:**
- ¿Stack preferido o abierto a sugerencias?
- ¿Hay requisitos de hosting/infra?
- ¿Auth necesaria? ¿Qué tipo?
- ¿Base de datos preferida?

**Bloque D — UX/UI:**
- ¿Público objetivo mobile/desktop/ambos?
- ¿Hay referencia visual o estilo deseado?
- ¿Alguna restricción de accesibilidad?

**Bloque E — Negocio:**
- ¿Hay monetización prevista?
- ¿Fecha objetivo o deadline?
- ¿Quién más verá/usará esto?

Al completar, generar `SPEC.md` en `mvps/{nombre}/docs/` y enviar resumen al usuario.
Pedir confirmación antes de avanzar.

### Fase 2: Diseño (agente ejecuta, consulta decisiones clave)

Ejecutar internamente los 3 agentes de diseño (00-*):

1. **Design Architect** → C4 Context + Containers + ADRs
2. **Domain Modeler** → Bounded contexts, agregados, glosario
3. **Flow Designer** → User flows, edge cases, secuencias

Artefactos en `mvps/{nombre}/docs/design/`:
```
design/
├── c4/
│   ├── context.mmd
│   ├── containers.mmd
│   └── components.mmd (si aplica)
├── domain/
│   ├── bounded-contexts.md
│   ├── aggregates.md
│   └── ubiquitous-lang.md
├── flows/
│   ├── user-flow-{nombre}.mmd
│   └── edge-cases.md
├── decisions/
│   └── ADR-NNN-{titulo}.md
└── DESIGN-SUMMARY.md
```

**Consultar al usuario SOLO cuando:**
- Hay múltiples opciones técnicas válidas (BD, framework, hosting)
- Decisión de arquitectura con trade-offs significativos
- Ambigüedad en requisitos funcionales

### Fase 3: Arquitectura (requiere aprobación)

Presentar al usuario un resumen ejecutivo:
- Stack elegido y justificación
- Diagrama C4 Containers (descripción textual para WhatsApp)
- ADRs clave
- Estructura de carpetas propuesta

**Esperar aprobación explícita** antes de implementar. Iterar si hay feedback.

### Fase 4: Implementación (agente autónomo)

Ejecutar sin preguntar:

1. **Project Setup** → Scaffold, dependencias, configs
2. **Arquitectura** → Estructura de código, modelos, rutas
3. **UI/UX** → Componentes, páginas, estilos
4. **Testing** → Tests unitarios + e2e (cobertura >= 80%)

Usar sub-agentes (`sessions_spawn`) para paralelizar cuando sea posible.

Commitear progreso incrementalmente con mensajes descriptivos.

### Fase 5: Polish (agente autónomo)

1. **Documentación** → README.md completo, API docs si aplica
2. **CI/CD** → GitHub Actions workflow básico
3. **Deployment config** → Dockerfile, docker-compose, o config del hosting elegido

### Fase 6: Delivery

1. Crear repo en GitHub (`vjrivmon/{nombre}`) via `gh` CLI o API
2. Push de todo el código
3. Notificar al usuario:
   - Link al repo
   - Instrucciones para clonar y ejecutar
   - Resumen de lo implementado vs SPEC
   - Issues conocidos o pendientes

## Reglas

### El usuario decide:
- Nombre, features, prioridades
- Stack cuando tiene preferencia
- Aprobación de arquitectura
- Qué iterar post-delivery

### VisiClaw decide:
- Implementación técnica detallada
- Patrones de código, estructura interna
- Tests (qué y cómo testear)
- UX/UI (componentes, layout, estilos)
- Configuración de CI/CD y deployment

### Comunicación:
- Preguntas en bloques de 2-3, no interrogatorios
- Resúmenes ejecutivos, no documentos largos por chat
- Para WhatsApp: sin tablas markdown, usar listas
- Avisar al usuario cuando se pasa a fase nueva
- Enviar link al repo al finalizar

### Calidad:
- Design-First siempre (SPEC → Diseño → Código)
- Tests obligatorios (min 80% cobertura)
- Commits descriptivos en español
- README completo con instrucciones de setup
- No deployer a producción — Vicente lo hace

## Estado del MVP

Mantener estado en `mvps/{nombre}/MVP-STATUS.md`:

```markdown
# MVP: {nombre}
## Estado: {fase actual}
## Fases completadas: [x] Entrevista [x] Diseño [ ] ...
## Última actualización: {fecha}
## Notas: ...
```

## Escalabilidad

Para añadir nuevas fases o agentes:
1. Añadir sección en este SKILL.md
2. Documentar inputs/outputs
3. Definir qué requiere aprobación del usuario vs autónomo
4. Actualizar el flujo de fases

Para skills especializadas (auth, billing, etc.), ver:
- `references/specialized-skills.md` (crear cuando se necesite)
