# Flujos de Usuario — App de Pus (v2 Completo)

---

## Navegación Global

```
┌──────────────────────────────────────┐
│                                      │
│          [Contenido página]          │
│                                      │
├──────────────────────────────────────┤
│  🏠 Home │ 🛒 Compra │ 📋 Menú │ 💰 │  ← Bottom tab bar (4 tabs)
└──────────────────────────────────────┘
```

- **Tab Home**: Dashboard con resumen + quick actions
- **Tab Compra**: Lista activa (si hay) o crear nueva
- **Tab Menú**: Menú de la semana actual
- **Tab Finanzas**: Balance + ingresos/gastos + patrimonio + más
- **Swipe Left (Home)**: Cámara rápida
- **Settings**: Gear icon en Home → push navigation

---

## F1: Compra Inteligente

### Happy Path

```
[Home] → "Nueva compra" → [Crear Lista] → [Editar Lista] → [Modo Compra] → [Finalizar] → [Resumen]
```

**1. Crear lista:**
- Nombre (auto: "Compra {fecha}")
- Supermercado (selector: Mercadona, Lidl, Aldi, Consum, Otro)
- Presupuesto (numérico, default último usado)
- → Estado `borrador`

**2. Editar lista (borrador):**
- Input text → Enter → añade producto
- Productos frecuentes: chips rápidos
- Cada producto: nombre, cantidad (±), unidad, categoría (opcional)
- Drag & drop para reordenar
- Agrupados por categoría visual
- Botón "Empezar compra" → cambia a `en_compra`

**3. Modo Compra (UNA PANTALLA):**
- Header: supermercado + gastado/presupuesto
- Barra de progreso con %
- Lista: checked (con precio arriba) + pendientes (abajo)
- Tap producto pendiente → seleccionar
- Opción A: 📸 Foto → Gemini OCR → confirmar precio → check
- Opción B: ✏️ Manual → keypad numérico → check
- Progress bar actualiza en tiempo real
- Bottom tab bar OCULTA (máximo espacio)
- "+ Añadir producto" para items improvisados

**4. Finalizar:**
- Confirmación: total + ahorro vs presupuesto
- Crea snapshot (Compra + CompraItems) inmutable
- Ofrece "¿Añadir como gasto compartido?"
- Estado → `finalizada`

**5. Resumen post-compra:**
- Total, nº productos, % presupuesto
- Lista de lo comprado con precios
- Botón compartir (Web Share API)
- Link a gasto compartido si se creó

### Edge Cases

| Caso | Comportamiento |
|---|---|
| OCR no reconoce precio | "No se pudo leer. ¿Introducir manualmente?" + input numérico |
| Supera presupuesto | Barra roja + haptic + alerta: "⚠️ Te has pasado X€" — NO bloquea |
| Producto no en lista | "+ Añadir producto" en modo compra |
| Irene añade producto en tiempo real | Realtime: aparece con animación |
| App cerrada en modo compra | Estado `en_compra` persiste. Retoma al volver |
| Conexión lenta | Spinner en OCR. Lista funciona (ya cargada) |
| Foto borrosa | Gemini confianza baja → "¿Es 2,35€?" con opción corregir |
| Lista vacía | No se puede empezar compra. "Añade productos primero" |
| Presupuesto = 0 | Se permite pero sin barra de progreso, solo total |
| Doble tap en producto checked | Deshace check, devuelve precio a pendiente |

---

## F2: Historial de Compras

### Happy Path

```
[Compra Tab] → [···] → [Historial] → [Filtrar] → [Detalle] → [Tendencia Producto]
```

1. Lista de compras finalizadas agrupadas por mes
2. Filtros: periodo, supermercado
3. Detalle: fecha, super, presupuesto vs total, lista de items
4. Tap producto → tendencia de precio en últimas compras
5. Dashboard mensual: total del mes en header

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Sin compras | Empty state con CTA "Haz tu primera compra" |
| Producto nombres similares | Búsqueda fuzzy |
| Muchas compras | Paginación infinita |

---

## F3: Menú Semanal

### Happy Path

```
[Tab Menú] → [Grid Semana] → [Tap slot] → [Buscar/Crear Receta] → [Asignar] → [Generar Lista]
```

1. Grid 7×2 (lunes-domingo × comida/cena)
2. Tap slot vacío → Bottom sheet con búsqueda de recetas
3. Seleccionar receta existente o crear nueva
4. Nueva receta: nombre, porciones, tiempo, ingredientes
5. "Generar lista" → agrega ingredientes, suma cantidades iguales
6. Preview de lista + coste estimado
7. Confirmar → crea ListaCompra borrador → redirige a Compra

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Semana sin recetas | "Planifica al menos una comida" |
| Receta sin ingredientes | Se salta en generación |
| Ingrediente sin precio histórico | "Precio desconocido" en estimación |
| Edición simultánea | Realtime sync |
| Semana pasada | Read-only (se puede ver pero no editar) |
| Navegar semanas futuras | Slots vacíos auto-creados |
| Nota libre (sin receta) | Se puede escribir "Pizza" o "Sobras" directamente |

---

## F4: Gastos Compartidos

### Happy Path

```
[Finanzas Tab] → [Balance] → [+ Gasto] → [Formulario] → [Guardar] → [Balance actualizado]
```

1. Card balance: "Irene debe 23,50€ a Vicente"
2. Lista de últimos gastos con categoría, quién, importe
3. "+ Nuevo gasto" → Sheet:
   - Importe (numérico grande)
   - Concepto (texto)
   - Categoría (chips: 11 categorías con emoji)
   - Pagado por (segmented: Vicente / Irene / Conjunta)
   - Tipo dinero (radio: Efectivo / Digital)
   - Fecha (default hoy)
4. Guardar → balance recalculado
5. Distribución por categoría visual (barras horizontales)

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Balance = 0 | "Estáis en paz ✌️" |
| Gasto desde compra | Pre-rellenado desde F1 finalización |
| Editar gasto | Swipe left → edit |
| Borrar gasto | Swipe left → confirmar → recalcula |
| Categoría "transferencia" | Oculta en selector de nuevo gasto (solo vía Transferencia) |
| Gasto de cuenta conjunta | clasificación = "conjunta" automático |

---

## F5: Ingresos

### Happy Path

```
[Finanzas Tab] → [Ingresos] → [+ Ingreso] → [Formulario] → [Guardar]
```

1. Tab "Ingresos" en segmented control
2. Cards por persona con items por categoría y tipo F/D
3. Total del mes
4. "+ Añadir ingreso" → Sheet:
   - Importe
   - Concepto
   - Categoría (chips: 6 categorías)
   - Para quién (Vicente / Irene / Conjunta / Otro→Conjunta)
   - Tipo dinero (Efectivo / Digital)
   - Fecha
5. Guardar → patrimonio recalculado

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Ingreso a "Otro→Conjunta" | marca esTercero=true, quien="conjunta" |
| Sin ingresos este mes | "Sin ingresos" con CTA |
| Categoría transferencia | Oculta, solo se crea vía pantalla Transferencia |

---

## F6: Patrimonio

### Flujo (automático, vista)

```
[Finanzas Tab] → [Balance] → [Card Patrimonio] → [Detalle por persona]
```

1. Patrimonio visible en la card de Balance tab
2. Por persona: Físico + Digital = Total
3. Conjunta: saldo acumulado
4. Total familia: suma de los 3
5. Calculado automáticamente desde saldos iniciales + movimientos

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Saldos iniciales no configurados | Patrimonio = 0 + movimientos desde siempre |
| Patrimonio negativo | Se muestra en rojo |
| Aportación a conjunta | Resta de digital personal, suma a conjunta |

---

## F7: Cuenta Conjunta

### Happy Path

```
[Finanzas Tab] → [Más] → [Cuenta Conjunta] → [Ver tabla] → [Registrar aportación]
```

1. Stats rápidos: saldo inicial, entradas, gastos, saldo actual
2. Tabla mensual horizontal scrollable: aportaciones + gastos + saldo acumulado
3. Registrar aportación manual (Vicente, Irene, Otros por mes)
4. Sugerencia de aportación igualitaria

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Mes sin aportaciones | Celdas vacías "-" |
| Saldo negativo | Rojo con warning |
| Doble registro mismo mes | Actualiza el existente (no duplica) |

---

## F8: Transferencias

### Happy Path

```
[Finanzas Tab] → [Balance] o [Más] → [Transferencia] → [Formulario] → [Confirmar]
```

1. Seleccionar origen (Vicente / Irene / Conjunta)
2. Seleccionar destino (diferente al origen)
3. Importe + concepto + fecha
4. Confirmar → crea gasto en origen + ingreso en destino
5. Ambos con transferenciaId compartido

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Origen = Destino | "Origen y destino deben ser diferentes" |
| Importe 0 | "Introduce un importe válido" |
| Transferencia a conjunta | Descuenta de digital personal, suma a conjunta |

---

## F9: Becas y Ayudas

### Happy Path

```
[Finanzas Tab] → [Más] → [Becas] → [+ Beca] → [Formulario]
```

1. Lista de becas: Pendientes (siempre), Mensuales (siempre), Cobradas (del mes)
2. Nueva beca: nombre, quién, importe, nº pagos, estado
3. Si estado = "cobrada" → fecha de cobro obligatoria
4. Becas cobradas se convierten en ingresos en migración

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Sin becas | Empty state |
| Cambiar estado | Actualiza y ajusta visibilidad por mes |
| Beca sin fecha cobro (legacy) | Aparece siempre |

---

## F10: Metas de Ahorro

### Happy Path

```
[Finanzas Tab] → [Más] → [Metas] → [+ Meta] → [Ver progreso] → [Aportar]
```

1. Grid/lista de metas con barra de progreso
2. Nueva meta: nombre, objetivo €, actual €, fecha límite, color
3. Tap [+] en meta → prompt "¿Cuánto aportar?" → suma
4. Meta completada (100%): badge de éxito
5. Meta vencida: indicador visual

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Sin metas | Empty state con CTA |
| Aportación > restante | Se permite (puede superar objetivo) |
| Meta sin fecha | Sin indicador de días restantes |
| Meta vencida y no completada | Texto "Vencida" en rojo |

---

## F11: Pagos Recurrentes

### Happy Path

```
[Finanzas Tab] → [Más] → [Pagos Recurrentes] → [Lista] → [+ Nuevo]
```

1. Lista de pagos recurrentes: concepto, importe, día del mes, categoría
2. Indicador: pagado/pendiente este mes
3. Nuevo: concepto, importe, día de cobro, categoría

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Pago vencido (día pasado) | Warning si no está marcado como pagado |
| Sin pagos | Empty state |

---

## F12: Calculadora Hipoteca

### Happy Path

```
[Finanzas Tab] → [Más] → [Calculadora Hipoteca] → [Ajustar parámetros] → [Ver resultados]
```

1. Formulario con sliders y inputs
2. Resultados en tiempo real (recalcula al cambiar cualquier campo)
3. Comparación patrimonio vs necesario con barra de progreso
4. Persistente: se guarda la configuración

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Ratio > 35% | Warning rojo "Supera límite recomendado" |
| Ratio 30-35% | Warning naranja "Cercano al límite" |
| Patrimonio > necesario | "EXCEDENTE" en verde |
| Campos vacíos | Defaults razonables |

---

## F13: Tareas del Hogar

### Happy Path

```
[Home] → [Card Tareas] → [Ver todas] → [Marcar hecho]
```

1. En Home: card con tareas vencidas (si hay)
2. Pantalla completa: 12 tareas fijas con estado visual
3. Tap "✓ Hecho" → actualiza fecha + guarda en historial
4. Estados: OK (verde), Warning ≤1 día (naranja), Vencida (rojo), Sin hacer (gris)

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Todas al día | "✓ Todo al día" en verde |
| Marcar hecho una vencida | Resetea contador, sale de historial reciente |
| Sin historial | No se muestra sección de historial |

---

## F14: Gráficos

### Happy Path

```
[Finanzas Tab] → [Más] → [Gráficos]
```

1. Evolución 6 meses: barras comparativas ingresos/gastos
2. Distribución gastos: barras horizontales por categoría con %
3. Balance mensual por persona: barras positivas/negativas

---

## F15: Export / Import

### Happy Path

```
[Settings] → [Datos] → [Exportar/Importar]
```

- Export JSON: descarga completa
- Export Excel mes: 3 hojas (Ingresos, Gastos, Resumen)
- Export Excel anual: 4 hojas (Ingresos 12m, Gastos 12m, Balance, Compra Piso)
- Import JSON: confirmar reemplazo → recarga

### Edge Cases

| Caso | Comportamiento |
|---|---|
| JSON corrupto | "Error en archivo" |
| Import sin confirmar | No se aplica |
| Datos vacíos para export | Hojas con "Sin datos" |

---

## F16: Presupuesto Mensual

### Flujo (visible en Home + Finanzas)

```
[Settings] → [Presupuesto mensual: 2.000€] → [Home dashboard] → [Barra progreso]
```

1. Configurar en Settings
2. Visible en Home como card con barra
3. En Finanzas/Balance como sección
4. Alertas automáticas:
   - 80%: barra naranja + texto warning
   - 100%: barra roja + texto alerta
   - >100%: "⚠️ Superado en X€"

---

## F17: Cierre de Mes

### Happy Path

```
[Finanzas Tab] → [Más] → [Cerrar Mes] → [Confirmar saldos] → [Guardado]
```

1. Muestra saldos calculados de cada persona
2. Confirmación con resumen
3. Guarda snapshot de saldos en saldosMensuales
4. Usado como referencia para siguiente mes

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Mes ya cerrado | Actualiza (no duplica) |
| Saldos negativos | Se guardan igualmente |
| Sin movimientos en el mes | Se guardan saldos = 0 |

---

## Auth & Hogar

### Login

```
[App] → [Login Screen] → [Email + Magic Link] → [Check email] → [Click link] → [App]
```

### Setup Hogar (primera vez)

```
[Login] → [Setup Hogar] → [Crear nuevo] o [Unirse con código]
```

**Crear nuevo:**
1. Crea hogar con usuario como primer miembro
2. Puede generar código de invitación (6 chars, 24h)
3. Comparte código con pareja

**Unirse:**
1. Introduce código de 6 caracteres
2. Verifica: no expirado, no usado, hogar <2 miembros
3. Añade usuario al hogar

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Código expirado | "Este código ha expirado" |
| Código ya usado | "Este código ya fue utilizado" |
| Hogar con 2 miembros | "El hogar ya tiene 2 miembros" |
| Ya miembro | "Ya eres miembro de este hogar" |
| Sin conexión en login | "Sin conexión. Inténtalo más tarde" |

---

## Swipe Camera (desde Home)

### Happy Path

```
[Home] → Swipe Left → [Camera fullscreen] → [Capture] → [OCR] → [Confirm price] → [Add to active list]
```

1. Swipe left en Home abre cámara fullscreen
2. Capture foto del precio
3. Gemini OCR extrae precio
4. Bottom sheet: precio detectado + selector de producto
5. Si hay lista en_compra activa: auto-selecciona producto pendiente
6. Si no hay lista: crea producto suelto en lista borrador

### Edge Cases

| Caso | Comportamiento |
|---|---|
| Sin lista activa | Ofrece crear nueva lista o añadir a borrador |
| Sin permiso cámara | "Permite acceso a la cámara en Ajustes" |
| OCR falla | Input manual como fallback |
| Múltiples precios en foto | Seleccionar el correcto de una lista sugerida |
