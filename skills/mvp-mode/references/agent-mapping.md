# Agent Mapping — Setup-Software-IA → MVP Mode

Referencia de cómo cada agente del framework original se mapea al flujo conversacional.

## Agentes de Diseño (Fase 2)

| Agente Original | Rol | En MVP Mode |
|---|---|---|
| 00-design-architect | C4 + ADRs | VisiClaw genera internamente, consulta decisiones técnicas |
| 00-domain-modeler | DDD: bounded contexts, agregados | VisiClaw genera internamente |
| 00-flow-designer | User flows, secuencias, edge cases | VisiClaw genera internamente |

## Agentes de Implementación (Fases 4-5)

| Agente Original | Rol | En MVP Mode |
|---|---|---|
| 01-project-setup | Scaffold proyecto | VisiClaw ejecuta autónomo |
| 02-git-cicd | Git + CI/CD | VisiClaw ejecuta autónomo |
| 03-architecture | Diseño arquitectónico | VisiClaw presenta para aprobación |
| 04-ui-ux | Interfaces | VisiClaw ejecuta autónomo |
| 05-testing | Tests TDD | VisiClaw ejecuta autónomo |
| 06-documentation | Docs | VisiClaw ejecuta autónomo |
| 07-deployment | Deploy config | VisiClaw ejecuta autónomo |

## Agentes Avanzados (futuro)

| Agente Original | Rol | En MVP Mode |
|---|---|---|
| 08-integrator | Integración de módulos | Cuando MVP tenga múltiples módulos paralelos |
| 09-scaler | Optimización y escalado | Post-MVP, cuando se necesite |
| 10-qa-final | QA final completo | VisiClaw lo integra en Fase 4 |

## Paralelización

En el framework original, algunos agentes corren en paralelo via worktrees.
En MVP Mode, usar `sessions_spawn` para sub-agentes cuando:
- Frontend y backend son independientes
- Tests se pueden escribir en paralelo a la implementación
- Documentación se puede generar mientras se hacen últimos ajustes

## Skills Especializadas Disponibles

Del framework original, estas skills se pueden invocar cuando apliquen:
- `auth-security` → Cuando el MVP necesite autenticación
- `billing-saas` → Cuando haya monetización/pagos
- `ux-ui` → Heurísticas de Nielsen para validación UX
- `production-readiness` → Checklist pre-producción
- `shape-up` → Para scoping tipo Basecamp
- `hardening-interviewer` → Post-MVP, feedback del usuario
