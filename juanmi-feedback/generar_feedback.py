"""
generar_feedback.py  v2
=======================
Lee un Excel con alumnos y notas, genera feedback personalizado
usando el servidor Ollama de VRAIN (llama3.3:70b).

Uso:
    python3 generar_feedback.py
    python3 generar_feedback.py --excel mis_notas.xlsx
    python3 generar_feedback.py --dry-run   # Solo muestra los prompts, sin llamar al LLM

Columnas del Excel (ajusta los COL_* si tu Excel usa otros nombres):
    Nombre, Apellidos, Nota_P1, Nota_Final, Comentario_Profe, Asistencia
    (Nota_P1, Comentario_Profe y Asistencia son opcionales)

Requisitos:
    pip install pandas openpyxl requests
"""

import argparse
import json
import time
import sys
import random

import pandas as pd
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ─────────────────────────────────────────────
#  CONFIGURACIÓN
# ─────────────────────────────────────────────
VRAIN_URL = "https://ollama.gti-ia.upv.es:443/api/generate"
MODELO    = "llama3.3:70b"
TIMEOUT   = 120

# Nombres de columna en el Excel (cambiar si el tuyo es diferente)
COL_NOMBRE      = "Nombre"
COL_APELLIDOS   = "Apellidos"
COL_NOTA_P1     = "Nota_P1"           # nota del primer parcial/práctica (opcional)
COL_NOTA_FINAL  = "Nota_Final"        # nota actual / definitiva
COL_COMENTARIO  = "Comentario_Profe"  # observación privada del profesor (opcional)
COL_ASISTENCIA  = "Asistencia"        # Alta / Media / Baja  (opcional)


# ─────────────────────────────────────────────
#  LÓGICA DE PROGRESIÓN
# ─────────────────────────────────────────────
def analizar_progresion(nota_p1, nota_final):
    """
    Compara la nota del parcial con la nota final y devuelve
    un bloque de texto listo para incluir en el prompt.
    """
    if nota_p1 is None or nota_final is None:
        return ""

    diff = nota_final - nota_p1

    if diff >= 2:
        return (
            f"Progresión: ha subido notablemente desde el primer parcial ({nota_p1}/10) "
            f"hasta ahora ({nota_final}/10). Refleja claramente esta mejora con un tono "
            f"de enhorabuena genuina y anímale a mantener ese ritmo."
        )
    elif diff >= 0.5:
        return (
            f"Progresión: ha mejorado ligeramente desde el primer parcial ({nota_p1}/10) "
            f"hasta la nota actual ({nota_final}/10). Reconoce el avance sin exagerar."
        )
    elif diff >= -0.5:
        return (
            f"Progresión: se ha mantenido estable entre el primer parcial ({nota_p1}/10) "
            f"y la nota actual ({nota_final}/10)."
        )
    elif diff >= -2:
        return (
            f"Progresión: ha bajado desde el primer parcial ({nota_p1}/10) hasta ahora "
            f"({nota_final}/10). Indícale con naturalidad que tiene margen de mejora "
            f"y que debe apretar en lo que queda."
        )
    else:
        return (
            f"Progresión: ha caído bastante desde el primer parcial ({nota_p1}/10) "
            f"hasta la nota actual ({nota_final}/10). Sé directo pero constructivo: "
            f"debe reaccionar cuanto antes si quiere enderezar la asignatura."
        )


def analizar_asistencia(valor):
    """Devuelve texto contextual según el valor de asistencia."""
    if pd.isna(valor) or str(valor).strip() == "":
        return ""
    v = str(valor).strip().lower()
    if v in ("alta", "sí", "si", "s", "yes", "1", "true"):
        return (
            "Asistencia: el alumno ha asistido regularmente a clase. "
            "Agradécele de forma sincera y natural el esfuerzo de venir y participar."
        )
    elif v in ("media", "regular"):
        return "Asistencia: asistencia irregular. Puedes animarle a venir más si lo ves oportuno."
    elif v in ("baja", "no", "n", "0", "false"):
        return (
            "Asistencia: ha faltado bastante a clase. "
            "Puedes mencionarlo con tacto si encaja con el contexto del mensaje."
        )
    return ""


# ─────────────────────────────────────────────
#  CONSTRUCCIÓN DEL PROMPT
# ─────────────────────────────────────────────
def construir_prompt(row: pd.Series, idx: int = 0) -> str:
    nombre     = str(row.get(COL_NOMBRE, "")).strip()
    apellidos  = str(row.get(COL_APELLIDOS, "")).strip()
    nombre_completo = f"{nombre} {apellidos}".strip()

    nota_final = row.get(COL_NOTA_FINAL)
    nota_p1    = row.get(COL_NOTA_P1) if COL_NOTA_P1 in row.index else None
    if pd.isna(nota_p1):
        nota_p1 = None

    # Nivel académico
    if nota_final >= 9:
        nivel = "sobresaliente"
    elif nota_final >= 7:
        nivel = "notable"
    elif nota_final >= 5:
        nivel = "aprobado"
    else:
        nivel = "suspenso"

    # Bloques de contexto
    bloque_progresion  = analizar_progresion(nota_p1, nota_final)
    bloque_asistencia  = analizar_asistencia(row.get(COL_ASISTENCIA, ""))

    comentario_profe = ""
    if COL_COMENTARIO in row.index:
        val = row[COL_COMENTARIO]
        if pd.notna(val) and str(val).strip():
            comentario_profe = f'Observación del profesor: "{str(val).strip()}"'

    # Contexto adicional (solo las líneas que tienen contenido)
    contexto_extra = "\n".join(
        line for line in [bloque_progresion, bloque_asistencia, comentario_profe]
        if line
    )
    if contexto_extra:
        contexto_extra = f"\nContexto adicional:\n{contexto_extra}\n"

    # Nota del parcial para el cuerpo del mensaje
    info_parcial = ""
    if nota_p1 is not None:
        info_parcial = f"\n- Primer parcial: {nota_p1}/10"

    # Semilla de variación para reducir repetición entre alumnos
    variaciones = [
        "Varía el inicio: usa una apertura distinta a 'Tu rendimiento...' o 'Has demostrado...'.",
        "Empieza con algo concreto sobre su nota o su progresión, sin fórmulas genéricas.",
        "Abre con la observación más llamativa de su caso antes de dar el contexto general.",
        "Comienza de forma directa, como si fuera un mensaje de WhatsApp de un profe cercano.",
    ]
    variacion = variaciones[idx % len(variaciones)]

    prompt = f"""Eres el profesor Juanmi, docente de Inteligencia Artificial en la UPV (Universidad Politécnica de Valencia).
Estás escribiendo un mensaje de feedback individual para tu alumno/a {nombre_completo}.

Datos del alumno/a:
- Nombre: {nombre}
- Nota actual: {nota_final}/10 ({nivel}){info_parcial}
{contexto_extra}
Instrucciones de escritura:
- Escribe en primera persona, como si fuera un mensaje directo del profesor al alumno.
- Tono cercano y humano, como un profe que conoce al alumno, no como una IA.
- NO uses frases hechas como "espero que este feedback te sea útil", "no dudes en contactarme", "es un placer", etc.
- {variacion}
- Si hay progresión (subida o bajada de nota), menciónala de forma natural y específica.
- Si hay observación del profesor, intégrala en el texto sin citarla literalmente.
- Si la asistencia es alta, agradece su presencia en clase de forma sincera y breve.
- Máximo 120 palabras. Sin saludos de correo formal ni despedidas largas.
- Escribe ÚNICAMENTE el texto del feedback, nada más.

### Assistant:
"""
    return prompt


# ─────────────────────────────────────────────
#  LLAMADA AL LLM
# ─────────────────────────────────────────────
def llamar_vrain(prompt: str, modelo: str = MODELO) -> str:
    payload = {"model": modelo, "prompt": prompt, "stream": False}
    resp = requests.post(
        VRAIN_URL,
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload),
        verify=False,
        timeout=TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Feedback personalizado con LLM VRAIN")
    parser.add_argument("--excel",   default="notas_ia.xlsx")
    parser.add_argument("--salida",  default="feedback_generado.xlsx")
    parser.add_argument("--modelo",  default=MODELO)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--pausa",   type=float, default=1.5)
    args = parser.parse_args()

    print(f"📂 Leyendo: {args.excel}")
    try:
        df = pd.read_excel(args.excel)
    except FileNotFoundError:
        print(f"❌ No se encontró '{args.excel}'")
        sys.exit(1)

    print(f"   → {len(df)} alumnos\n")
    feedbacks = []

    for idx, row in df.iterrows():
        nombre = f"{row.get(COL_NOMBRE, '')} {row.get(COL_APELLIDOS, '')}".strip()
        nota   = row.get(COL_NOTA_FINAL, "?")
        print(f"[{idx+1}/{len(df)}] {nombre} — {nota}/10")

        prompt = construir_prompt(row, idx)

        if args.dry_run:
            print(prompt)
            feedbacks.append("[DRY RUN]")
            continue

        try:
            respuesta = llamar_vrain(prompt, modelo=args.modelo)
            print(f"   ✅ {len(respuesta)} chars\n")
            feedbacks.append(respuesta)
        except requests.exceptions.Timeout:
            print("   ⚠️  Timeout\n")
            feedbacks.append("ERROR: timeout")
        except requests.exceptions.RequestException as e:
            print(f"   ❌ {e}\n")
            feedbacks.append(f"ERROR: {e}")

        time.sleep(args.pausa)

    df["Feedback_LLM"] = feedbacks
    df.to_excel(args.salida, index=False)
    print(f"\n✅ Guardado en: {args.salida}")


if __name__ == "__main__":
    main()
