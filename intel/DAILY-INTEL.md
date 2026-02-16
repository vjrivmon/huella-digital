# Intel — 2026-02-16 (Lunes)

*Researcher Morning Scan @ 08:00 Madrid*

---

## Papers Relevantes

### 1. Krites: Semantic Caching con LLM-Judge Asíncrono
**[arXiv:2602.13165](https://arxiv.org/abs/2602.13165)** — cs.IR, cs.AI

Sistema de caching semántico para LLMs que usa un juez LLM asíncrono para validar respuestas cacheadas. Cuando una query cae *justo* debajo del threshold de similitud, Krites invoca el juez en background para decidir si la respuesta cacheada es válida. Si sí, la promueve al cache dinámico.

**Resultados:** Hasta 3.9x más requests servidos con respuestas curadas, sin impacto en latencia crítica.

**Por qué importa para el TFG:** El chatbot DNI podría beneficiarse de semantic caching para preguntas frecuentes de voluntarios. Un threshold conservador + validación async = mejor cobertura sin riesgo de respuestas incorrectas.

---

### 2. SCOPE: LLM-as-Judge con Garantías Estadísticas
**[arXiv:2602.13110](https://arxiv.org/abs/2602.13110)** — cs.CL, cs.AI

Framework para usar LLMs como jueces en evaluación pairwise con garantías conformal (error rate ≤ α garantizado). Introduce **Bidirectional Preference Entropy (BPE)** que elimina el bias de orden de respuestas.

**Resultados:** A α=0.10, mantiene cobertura de 0.89-0.98 en RewardBench mientras cumple el bound de riesgo.

**Por qué importa para el TFG:** Complementa RAGAS para evaluación. En lugar de métricas fijas, tener un LLM-judge con garantías estadísticas para comparar respuestas del chatbot DNI vs ground truth.

---

### 3. RGAlign-Rec: Intent Prediction en Chatbots
**[arXiv:2602.12968](https://arxiv.org/abs/2602.12968)** — cs.IR, cs.AI, cs.CL

Framework cerrado que alinea un LLM reasoner con señales de ranking downstream. El LLM predice intent latente del usuario, y el modelo de ranking refina la salida.

**Resultados:** +0.98% CTR en A/B test de Shopee.

**Por qué importa:** Aunque es para e-commerce, el patrón de "LLM razona intent → ranking refina" podría aplicarse a RAG: el retriever (ranking) da feedback al LLM para mejorar query understanding.

---

## Repos Trending

### Chroma (Vector DB) — ¡En trending!
**[github.com/chroma-core/chroma](https://github.com/chroma-core/chroma)**

El vector DB que usas para el TFG está trending hoy. **Chroma Cloud** ya disponible — hosting serverless con $5 de créditos gratis.

**Relevancia:** Ya usas ChromaDB local. Cuando DNI necesite escalar (más documentos, más usuarios), Chroma Cloud es opción sin cambiar código. API sigue siendo 4 funciones.

---

## Highlight Técnico: SQLite con Swarm de Agentes

**[Building SQLite with a Small Swarm](https://kiankyars.github.io/machine_learning/2026/02/12/sqlite.html)**

Kian Kyars usó 6 agentes en paralelo (2x Claude, 2x Codex, 2x Gemini) para construir un engine SQLite-like en Rust:
- **~19K líneas de código** en 2 días
- Parser, planner, executor, B+trees, WAL, recovery, joins, aggregates
- **282 tests passing**
- 54.5% de commits fueron coordinación (locks, claims)

**Patrón clave:**
- Cada agente: pull → claim task → implement → test vs sqlite3 oracle → push
- Módulos ortogonales (parser → planner → executor → storage) minimizan colisiones
- Tests son la "fuerza anti-entropía"
- Shared docs (PROGRESS.md) son runtime, no documentación

**Por qué importa:** Validación práctica de arquitectura multi-agente con coordinación via git/locks/tests. Directly aplicable a tu setup multi-agente (VisiClaw + Researcher + TFG-Writer).

---

## Noticias Tech

- **Audio AI dominado por labs pequeños** — [amplifypartners.com](https://www.amplifypartners.com/blog-posts/arming-the-rebels-with-gpus-gradium-kyutai-and-audio-ai): A diferencia de LLMs donde escala gana, en audio los labs pequeños (Kyutai, etc.) están compitiendo bien. Oportunidad en nichos donde compute no lo es todo.

- **MicroGPT visualizable** — [microgpt.boratto.ca](https://microgpt.boratto.ca): GPT minimalista que puedes visualizar en el browser. Útil para demos educativas o entender transformers internamente.

- **Claude + Pen Plotter** — [harmonique.one](https://harmonique.one/posts/i-gave-claude-access-to-my-pen-plotter): Alguien dio a Claude acceso a hardware físico (plotter). Patrón de agentes + mundo real, relevante para Zyndra.

- **NotebookLM voice cloning controversy** — Google acusado de "robar voces" con NotebookLM. Reminder de riesgos éticos en generación de audio.

---

## Conexiones con TFG

| Paper/Repo | Aplicación al Chatbot DNI |
|------------|---------------------------|
| Krites (semantic cache) | Cachear respuestas frecuentes de voluntarios con validación async |
| SCOPE (LLM-judge) | Evaluación alternativa/complementaria a RAGAS con garantías |
| SQLite Swarm | Modelo de coordinación para multi-agente (if scales beyond 1 agent) |
| Chroma Cloud | Path de escalado cuando DNI crezca sin cambiar código |

---

*Próximo scan: mañana 08:00 Madrid*
