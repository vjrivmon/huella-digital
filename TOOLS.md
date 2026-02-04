# TOOLS.md - Local Notes

## 🚀 MVP Mode (skill propia)

**Activación:** Cuando Vicente mencione "MVP" en el chat.
**Ubicación:** `skills/mvp-mode/SKILL.md`
**Referencias:** `skills/mvp-mode/references/`

Flujo completo conversacional para generar MVPs. Basado en Setup-Software-IA.
Leer `skills/mvp-mode/SKILL.md` antes de ejecutar.

**Fases:**
0. Kickoff → nombre y pitch
1. Entrevista → 8-15 preguntas por chat (ver `references/interview-questions.md`)
2. Diseño → C4, DDD, flows (autónomo, consulta decisiones clave)
3. Arquitectura → presentar y pedir aprobación
4. Implementación → autónomo (UI, backend, tests)
5. Polish → docs, CI/CD, deploy config
6. Delivery → crear repo GitHub, push, notificar

**Repos de referencia:**
- Framework base: `workspace/Setup-Software-IA/`
- Agentes: `.claude/agents/` (13 agentes)
- Skills: `.claude/skills/` (651 skills)
- Templates: `.claude/templates/`

---

## Whisper.cpp (STT)

- Modelo: `small` en `/usr/local/share/whisper/ggml-small.bin`
- Wrapper: `/usr/local/bin/whisper-transcribe`
- Convierte OGG→WAV (ffmpeg) antes de transcribir
- ~20s para 2min de audio en CPU

## SSH

- GitHub: clave `visiclaw@openclaw` añadida a `vjrivmon`

## Repos Clonados

- `Osyris-Web/` — plataforma scout (branch activa: `feature/circular-digital-design`)
- `Setup-Software-IA/` — framework MVP con 13 agentes y 651 skills

## Notas

- No hay Brave API key (web_search no funciona)
- Auth: token Claude Max (anthropic:manual)
- Servidor: AMD EPYC-Rome, 7.6GB RAM, sin GPU
- No pushear a producción — Vicente lo hace
