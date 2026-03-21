"""
generar_feedback_juanmi.py  v1
==============================
Lee un Excel con la estructura de examen de Juanmi (ejercicio 1 cálculo + 3 preguntas teoría)
y genera feedback personalizado usando el servidor Ollama de VRAIN.

Columnas esperadas del Excel (ajustar COL_* si difieren):
    Nombre, Apellidos,
    Nota_P1                       <- nota parcial anterior
    Nota_Ej1, Max_Ej1, Feedback_Ej1
    Nota_Ej2, Max_Ej2, Feedback_Ej2
    Nota_Ej3a, Max_Ej3a, Feedback_Ej3a
    Nota_Ej3b, Max_Ej3b, Feedback_Ej3b
    Nota_P2                       <- nota de este parcial (ya calculada)
    Media_Falta                   <- media mínima en los 2 restantes para llegar a 4 global

Uso:
    python3 generar_feedback_juanmi.py
    python3 generar_feedback_juanmi.py --excel mis_notas.xlsx --salida resultado.xlsx
    python3 generar_feedback_juanmi.py --dry-run    # solo muestra prompts

Requisitos:
    pip install pandas openpyxl requests
"""

import argparse
import json
import sys
import time

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

# Nombres de columna (cambiar si el Excel usa nombres distintos)
COL_NOMBRE    = "Nombre"
COL_APELLIDOS = "Apellidos"
COL_NOTA_P1   = "Nota_P1"

COL_NOTA_EJ1     = "Nota_Ej1"
COL_MAX_EJ1      = "Max_Ej1"
COL_FEED_EJ1     = "Feedback_Ej1"

COL_NOTA_EJ2     = "Nota_Ej2"
COL_MAX_EJ2      = "Max_Ej2"
COL_FEED_EJ2     = "Feedback_Ej2"

COL_NOTA_EJ3A    = "Nota_Ej3a"
COL_MAX_EJ3A     = "Max_Ej3a"
COL_FEED_EJ3A    = "Feedback_Ej3a"

COL_NOTA_EJ3B    = "Nota_Ej3b"
COL_MAX_EJ3B     = "Max_Ej3b"
COL_FEED_EJ3B    = "Feedback_Ej3b"

COL_NOTA_P2     = "Nota_P2"
COL_MEDIA_FALTA = "Media_Falta"


# ─────────────────────────────────────────────
#  LÓGICA DE CONTEXTO
# ─────────────────────────────────────────────
def contexto_progresion(nota_p1, nota_p2) -> tuple[str, str]:
    """
    Devuelve (bloque_texto, tono_recomendacion) según la evolución entre parciales.
    """
    if nota_p1 is None or nota_p2 is None:
        return "", "neutro"

    diff = nota_p2 - nota_p1

    if diff >= 1.5:
        return (
            f"Ha mejorado claramente respecto al primer parcial ({nota_p1:.1f} → {nota_p2:.1f}). "
            "Destaca esta mejora con tono genuino de satisfacción.",
            "positivo"
        )
    elif diff >= 0.3:
        return (
            f"Ha mejorado algo respecto al primer parcial ({nota_p1:.1f} → {nota_p2:.1f}). "
            "Reconoce el avance sin exagerar.",
            "alentador"
        )
    elif diff >= -0.5:
        return (
            f"Resultado similar al primer parcial ({nota_p1:.1f} → {nota_p2:.1f}). "
            "Tono neutro, sin destacar ni subida ni bajada.",
            "neutro"
        )
    elif diff >= -1.5:
        return (
            f"Ha bajado respecto al primer parcial ({nota_p1:.1f} → {nota_p2:.1f}). "
            "Indícalo con naturalidad y anímale a apretar en los próximos contenidos.",
            "exigente"
        )
    else:
        return (
            f"Ha caído bastante desde el primer parcial ({nota_p1:.1f} → {nota_p2:.1f}). "
            "Sé directo pero constructivo: debe reaccionar cuanto antes.",
            "urgente"
        )


def necesita_tutorias(nota_p2, feedbacks: list[str]) -> bool:
    """
    Recomienda tutorías solo si la nota es muy baja o hay múltiples fallos graves.
    """
    if nota_p2 is not None and nota_p2 < 3.5:
        return True
    # Indicadores de carencias graves en los comentarios del profe
    keywords_graves = ["no contesta", "no responde", "incorrecto", "conceptual", "formulación diferente"]
    conteo_graves = sum(
        1 for fb in feedbacks
        if any(kw in (fb or "").lower() for kw in keywords_graves)
    )
    return conteo_graves >= 3


def tono_cierre(tono: str, media_falta) -> str:
    """
    Genera el fragmento de cierre/recomendación según el tono y la media que falta.
    """
    if media_falta is not None and media_falta > 6:
        extra = (
            f" Para llegar al mínimo de aprobado necesitas sacar una media de {media_falta:.1f} "
            "en los dos parciales que quedan, así que conviene ponerse desde ya."
        )
    else:
        extra = ""

    tonos = {
        "positivo":  "Dile que siga así, que si mantiene este nivel los próximos contenidos no deberían suponer problema.",
        "alentador": "Anímale a mantener la línea y a implicarse pronto en los nuevos temas.",
        "neutro":    "Recuérdale que es importante arrancar los nuevos contenidos desde el principio y no dejarlo para el final.",
        "exigente":  "Dile que tiene que apretar, que todavía puede enderezar la situación pero que no puede esperar.",
        "urgente":   "Sé muy directo: necesita un cambio de marcha importante para poder superar la asignatura.",
    }
    return tonos.get(tono, tonos["neutro"]) + extra


# ─────────────────────────────────────────────
#  CONSTRUCCIÓN DEL PROMPT
# ─────────────────────────────────────────────
APERTURAS = [
    "Empieza por la situación general del examen antes de entrar en detalle.",
    "Abre directamente con lo más llamativo: la bajada, la mejora o el punto débil clave.",
    "Comienza con algo concreto sobre lo que hizo bien o mal en el cálculo.",
    "Empieza de forma directa, como si fuera un mensaje de WhatsApp de un profe cercano.",
]

def construir_prompt(row: pd.Series, idx: int = 0) -> str:
    nombre     = str(row.get(COL_NOMBRE, "")).strip()
    apellidos  = str(row.get(COL_APELLIDOS, "")).strip()

    nota_p1  = _float(row.get(COL_NOTA_P1))
    nota_p2  = _float(row.get(COL_NOTA_P2))
    media_falta = _float(row.get(COL_MEDIA_FALTA))

    nota_ej1  = _float(row.get(COL_NOTA_EJ1));  max_ej1  = _float(row.get(COL_MAX_EJ1))
    nota_ej2  = _float(row.get(COL_NOTA_EJ2));  max_ej2  = _float(row.get(COL_MAX_EJ2))
    nota_ej3a = _float(row.get(COL_NOTA_EJ3A)); max_ej3a = _float(row.get(COL_MAX_EJ3A))
    nota_ej3b = _float(row.get(COL_NOTA_EJ3B)); max_ej3b = _float(row.get(COL_MAX_EJ3B))

    fb_ej1  = _str(row.get(COL_FEED_EJ1))
    fb_ej2  = _str(row.get(COL_FEED_EJ2))
    fb_ej3a = _str(row.get(COL_FEED_EJ3A))
    fb_ej3b = _str(row.get(COL_FEED_EJ3B))

    # Contexto de progresión
    bloque_progresion, tono = contexto_progresion(nota_p1, nota_p2)

    # ¿Tutorías sí o no?
    tutorias = necesita_tutorias(nota_p2, [fb_ej1, fb_ej2, fb_ej3a, fb_ej3b])
    instruccion_tutorias = (
        "Recuérdale que puede venir a tutorías si tiene dudas con los nuevos contenidos."
        if tutorias else
        "NO menciones tutorías en este caso."
    )

    cierre = tono_cierre(tono, media_falta)
    apertura = APERTURAS[idx % len(APERTURAS)]

    # Resumen de ejercicios para el prompt
    def ej_line(desc, nota, maximo, feedback):
        pct = f"{nota:.1f}/{maximo:.1f}" if nota is not None and maximo else "—"
        fb  = feedback if feedback else "sin observación"
        return f"- {desc}: {pct} — Observación del profesor: \"{fb}\""

    ejercicios = "\n".join([
        ej_line("Ejercicio de cálculo (División de conjuntos)", nota_ej1, max_ej1, fb_ej1),
        ej_line("Pregunta 2 (teoría)", nota_ej2, max_ej2, fb_ej2),
        ej_line("Pregunta 3a (teoría)", nota_ej3a, max_ej3a, fb_ej3a),
        ej_line("Pregunta 3b (teoría)", nota_ej3b, max_ej3b, fb_ej3b),
    ])

    prompt = f"""Eres el profesor Juanmi, docente universitario de Inteligencia Artificial en la UPV.
Escribe un mensaje de feedback individual para tu alumno/a {nombre} {apellidos}.

DATOS DEL EXAMEN:
{ejercicios}
Nota parcial anterior: {nota_p1 if nota_p1 is not None else "—"}/10
Nota este parcial: {nota_p2 if nota_p2 is not None else "—"}/10
{"Media mínima necesaria en los 2 parciales restantes para llegar a 4: " + f"{media_falta:.1f}/10" if media_falta is not None else ""}

CONTEXTO DE PROGRESIÓN:
{bloque_progresion if bloque_progresion else "Sin información de parcial anterior."}

INSTRUCCIONES DE ESCRITURA:
- Escribe en primera persona, como si fuera un mensaje directo de Juanmi al alumno.
- Tono cercano y profesional, como un profesor que conoce bien a sus alumnos.
- {apertura}
- NO menciones la nota de este parcial en el texto (el alumno ya la sabe).
- Solo menciona la nota del parcial anterior si hay una variación relevante (subida o bajada clara).
- Sé específico con los errores: usa las observaciones del profesor, no inventes.
- Si en alguna observación hay algo positivo ("casi bien", "detecta error"), inclúyelo brevemente.
- Si hay preguntas sin respuesta, mencíonalo con tacto.
- NO uses listas ni viñetas.
- NO repitas la misma información en distintos párrafos.
- EVITA frases hechas: "espero que este feedback...", "no dudes en contactarme", "es un placer", "ante cualquier duda...", "no dejes de..."
- Máximo 3 párrafos cortos. Total máximo 130 palabras.
- Escribe ÚNICAMENTE el texto del feedback, sin saludos de correo ni firma.

ESTRUCTURA DE LOS 3 PÁRRAFOS:
1) Párrafo de contexto: cómo ha resultado este parcial en términos generales.
   Tono según evolución: {"mejora clara → satisfacción genuina" if tono in ("positivo","alentador") else "bajada o estancamiento → directo pero constructivo"}
2) Párrafo de detalle: errores concretos por pregunta (sin nombrar "ejercicio 1", "pregunta 3a"..., describe el contenido).
3) Párrafo de cierre y orientación hacia los próximos contenidos (genética, búsqueda con adversario).
   {cierre}
   {instruccion_tutorias}

### Assistant:
"""
    return prompt


def _float(val):
    try:
        return float(val)
    except (TypeError, ValueError):
        return None

def _str(val):
    if val is None:
        return ""
    s = str(val).strip()
    return s if s and s.lower() not in ("nan", "none") else ""


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
    parser = argparse.ArgumentParser(description="Feedback examen IA — Juanmi")
    parser.add_argument("--excel",   default="notas_juanmi.xlsx")
    parser.add_argument("--salida",  default="feedback_juanmi.xlsx")
    parser.add_argument("--modelo",  default=MODELO)
    parser.add_argument("--dry-run", action="store_true", help="Mostrar prompts sin llamar al LLM")
    parser.add_argument("--pausa",   type=float, default=1.5, help="Segundos entre llamadas")
    args = parser.parse_args()

    print(f"📂 Leyendo: {args.excel}")
    try:
        df = pd.read_excel(args.excel)
    except FileNotFoundError:
        print(f"❌ No se encontró '{args.excel}'. Genera uno con crear_excel_juanmi.py")
        sys.exit(1)

    print(f"   → {len(df)} alumnos\n")
    feedbacks = []

    for idx, row in df.iterrows():
        nombre = f"{row.get(COL_NOMBRE, '')} {row.get(COL_APELLIDOS, '')}".strip()
        nota_p2 = _float(row.get(COL_NOTA_P2))
        print(f"[{idx+1}/{len(df)}] {nombre} — P2: {nota_p2}/10")

        prompt = construir_prompt(row, idx)

        if args.dry_run:
            print("─" * 60)
            print(prompt)
            print("─" * 60 + "\n")
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
