# Generador de Feedback Personalizado — LLM VRAIN

Automatiza el envío de comentarios académicos personalizados a alumnos
usando el servidor Ollama de VRAIN (UPV).

## Archivos

| Archivo | Descripción |
|---|---|
| `generar_feedback.py` | **Script principal** — lee Excel, llama al LLM, genera Excel con feedbacks |
| `crear_excel_ejemplo.py` | Genera un Excel de prueba con alumnos inventados |
| `notas_ia.xlsx` | Excel de ejemplo generado (reemplazar por el real) |
| `feedback_generado.xlsx` | Resultado (se crea al ejecutar el script) |

## Requisitos

```bash
pip install pandas openpyxl requests
```

## Uso rápido

```bash
# 1. Con el Excel de ejemplo (incluido)
python3 generar_feedback.py

# 2. Con tu propio Excel
python3 generar_feedback.py --excel mis_notas.xlsx

# 3. Probar sin llamar al LLM (ver los prompts)
python3 generar_feedback.py --dry-run

# 4. Cambiar modelo o archivo de salida
python3 generar_feedback.py --excel mis_notas.xlsx --modelo llama3.3:70b --salida resultado.xlsx
```

## Formato del Excel

El script espera estas columnas (los nombres deben coincidir):

| Columna | Obligatorio | Descripción |
|---|---|---|
| `Nombre` | ✅ | Nombre del alumno |
| `Apellidos` | ✅ | Apellidos |
| `Nota_Final` | ✅ | Nota numérica (0-10) |
| `Nota_P1` | ❌ | Nota práctica 1 (opcional) |
| `Nota_P2` | ❌ | Nota práctica 2 (opcional) |
| `Comentario_Profe` | ❌ | Observación privada del profesor (opcional) |

> Si tu Excel usa nombres de columna distintos, edita las constantes
> `COL_*` al inicio de `generar_feedback.py`.

## Resultado

Se genera un nuevo Excel (`feedback_generado.xlsx`) idéntico al original
pero con una columna extra `Feedback_LLM` con el comentario generado
para cada alumno.

## Personalizar el prompt

Edita la función `construir_prompt()` en `generar_feedback.py` para:
- Cambiar el tono (más formal, más cercano)
- Adaptar a otra asignatura
- Cambiar el límite de palabras
- Añadir criterios específicos de evaluación
