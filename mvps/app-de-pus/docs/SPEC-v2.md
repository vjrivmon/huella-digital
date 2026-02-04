# SPEC v2: App de Pus

## Visión
App unificada para Vicente e Irene que combina: **compra inteligente en el supermercado** (lista + tracking de presupuesto + OCR de precios), **menú semanal** con generación automática de lista de compra, **gestión financiera completa de pareja** (ingresos, gastos, patrimonio, cuenta conjunta, préstamos, calculadora hipoteca), y **organización del hogar** (tareas de limpieza, lista de compra rápida).

## Usuarios
- **Vicente** — usuario principal (m1)
- **Irene** — pareja, comparte todo (m2)
- Solo 2 usuarios. Auth ultra-simple.

## Problema que resuelve
1. Al hacer la compra semanal, Vicente tiene que alternar entre calculadora, notas y app de recetas. Quiere todo en UNA pantalla.
2. Gestionar las finanzas de pareja (quién pagó qué, cuánto debe quién, patrimonio conjunto) en una sola app en vez de Excel.
3. Coordinar tareas del hogar y menús semanales sin WhatsApp.

---

## Features Completas

### F1: Compra Inteligente (core)
- **Lista de la compra** — crear/editar lista de productos a comprar
- **Presupuesto** — definir límite (ej: 100€) antes de empezar
- **Añadir producto al carrito** — dos modos:
  - 📸 **Foto del precio** → Gemini Flash extrae precio automáticamente
  - ✏️ **Input manual** → teclado numérico rápido
- **Tracking en tiempo real** — barra de progreso: gastado vs presupuesto, cuánto queda
- **Checklist** — tachar productos de la lista al añadirlos al carrito
- **Una pantalla** — lista + carrito + presupuesto todo visible
- **Productos frecuentes** — lista de productos usados frecuentemente para añadir rápido (máx 15)
- **Categorías de producto**: general, frescos, carnicería, lácteos, limpieza, otros
- **Compartir lista** — vía Web Share API o copiar al portapapeles
- **Limpiar comprados** — eliminar todos los productos ya marcados

### F2: Historial de Compras
- Registrar cada compra: fecha, supermercado, total, lista de productos con precios
- Ver historial por día/semana/mes
- Tracking de precios por producto y supermercado (detectar subidas/bajadas)
- Dashboard simple: "este mes llevas X€ en compras"

### F3: Menú Semanal
- Planificar comidas de la semana (lunes-domingo, comida/cena)
- Compartido: Vicente e Irene ven y editan el mismo menú
- **Auto-generar lista de la compra** desde las recetas del menú
- **Estimar coste** basado en historial de precios
- Verificar en el super que llevas todo lo del menú

### F4: Gastos Compartidos (de AppGastos)
- Registrar gastos de pareja (quién pagó, cuánto, concepto)
- **3 pagadores**: Vicente (m1), Irene (m2), Cuenta Conjunta
- **Categorías de gasto**: Alquiler, Suministros, Internet+Móvil, Supermercado, Transporte, Ocio/Restaurantes, Ropa/Calzado, Salud, Suscripciones, IA/Tecnología, Otros
- **Tipo de dinero**: Efectivo (físico) / Digital (banco)
- **Clasificación**: Individual / Conjunta / Transferencia
- Balance 50/50 automático entre pareja
- Historial filtrable por mes/año
- **Vistas Excel-like** — tablas mensuales 12 columnas por categoría y persona con subtotales
- **Vista móvil** — cards por persona con items agrupados por categoría

### F5: Ingresos (de AppGastos)
- Registrar ingresos personales de cada miembro
- **Categorías**: Nómina, Pagas Extra, Freelance/Extra, Becas/Ayudas, Efectivo/Negro, Otros, Transferencia
- **Tipo de dinero**: Efectivo / Digital
- **Tipo de ingreso**: Fijo / Variable
- **Destinatarios**: Vicente, Irene, Cuenta Conjunta, Otra persona → Conjunta
- **Proyecciones**: marcar ingresos como proyectados
- **Tablas Excel-like** con split Físico/Digital por categoría y mes

### F6: Patrimonio (de AppGastos)
- **Cálculo automático** de patrimonio por persona:
  - Saldo Físico = Saldo inicial físico + Ingresos efectivo − Gastos efectivo
  - Saldo Digital = Saldo inicial digital + Ingresos digital − Gastos digital − Aportaciones a conjunta
- **Patrimonio total** = Vicente + Irene + Cuenta Conjunta
- **Saldos iniciales configurables** con fecha de referencia:
  - Vicente: físico + digital
  - Irene: físico + digital
  - Conjunta: físico + digital
- **Gráficos de balance mensual** por persona (barras positivas/negativas)

### F7: Cuenta Conjunta (de AppGastos)
- **Aportaciones mensuales** por persona (Vicente, Irene, Otros/intereses)
- **Saldo acumulado** = Saldo inicial + Σ aportaciones − Σ gastos conjuntos
- **Tabla Excel-like** con aportaciones, gastos y saldo mensual acumulado
- **Sugerencia de aportación igualitaria** basada en saldo digital disponible
- **Ingresos directos a conjunta** (de terceros, intereses, etc.)

### F8: Transferencias entre cuentas (de AppGastos)
- Transferir dinero entre: Vicente ↔ Irene ↔ Cuenta Conjunta
- Se registra como gasto en origen + ingreso en destino
- **TransferenciaId** compartido para vincular ambos movimientos
- Marcadas con categoría "transferencia" y clasificación "transferencia"

### F9: Becas y Ayudas (de AppGastos)
- Registrar becas/ayudas por persona
- **Estados**: Pendiente, Mensual, Cobrada
- **Fecha de cobro** (solo para cobradas)
- **Número de pagos**
- Al cobrar, se convierten en ingresos con categoría "becas"
- Filtrado por mes: mensuales siempre visibles, cobradas solo en su mes, pendientes siempre

### F10: Metas de Ahorro (de AppGastos)
- Crear metas con nombre, objetivo (€), actual (€), fecha límite, color
- **Barra de progreso** visual con porcentaje
- **Aportar a meta** — añadir cantidad manualmente
- **Días restantes** calculados automáticamente
- Indicador de meta vencida

### F11: Pagos Recurrentes (de AppGastos)
- Registrar pagos recurrentes: concepto, importe, día del mes, categoría
- Tracking de cuáles se han pagado este mes
- Alertas de pagos próximos

### F12: Calculadora Compra Piso (de AppGastos)
- **Datos de entrada**:
  - Precio vivienda
  - Tipo: Obra nueva / Segunda mano
  - Menor de 35 años (descuento ITP Valencia)
  - % Financiación (slider 50-100%)
  - TIN Anual (%)
  - Plazo en años (slider 10-40)
  - Ingresos netos/mes
  - Muebles/Reformas
  - Colchón de emergencia
- **Cálculos automáticos**:
  - Impuestos: IVA 10% + AJD 1.5% (nueva) o ITP 6%/10% (segunda mano)
  - Gastos notaría + registro + gestoría (~2%)
  - Tasación (400€)
  - Importe hipoteca
  - Entrada necesaria
  - **Cuota mensual** (fórmula francesa)
  - **Ratio de endeudamiento** (con alertas >30%, >35%)
  - Total necesario
  - Comparación con patrimonio disponible
  - Barra de progreso hacia objetivo
- **Persistente**: configuración se guarda y sincroniza

### F13: Tareas del Hogar / Limpieza (de AppGastos)
- **12 tareas fijas** con frecuencia predefinida:
  - Salón (7d), Cocina (3d), Baño (5d), Dormitorio (7d)
  - Basura (2d), Lavadora (3d), Tender (3d), Planchar (7d)
  - Suelos (5d), Polvo (7d), Cristales (14d), Nevera (14d)
- **Estado visual**: OK / Warning (≤1 día) / Overdue (vencida)
- **Marcar como hecho** → actualiza fecha y guarda en historial
- **Contador de penalizaciones** por tareas vencidas
- **Historial de limpieza** — últimas 8 acciones con fecha/hora

### F14: Gráficos Interactivos (de AppGastos)
- **Evolución últimos 6 meses** — barras comparativas ingresos vs gastos
- **Distribución de gastos por categoría** — barras horizontales con % y colores
- **Balance mensual por persona** — barras positivas/negativas
- Actualización automática al cambiar mes/año

### F15: Export / Import (de AppGastos)
- **Export JSON** — backup completo de todos los datos
- **Import JSON** — restaurar desde backup
- **Export Excel mensual** — 3 hojas: Ingresos, Gastos, Resumen
- **Export Excel anual** — 4 hojas: Ingresos (12 meses), Gastos (12 meses), Balance, Compra Piso
- Usa librería XLSX (SheetJS)

### F16: Presupuesto Mensual con Alertas
- Definir presupuesto mensual global
- **Alertas automáticas**:
  - 80% del presupuesto: warning amarillo
  - 100% del presupuesto: alerta roja
- Barra de progreso visual en dashboard

### F17: Cierre de Mes (de AppGastos)
- **Cerrar mes** — guarda snapshot de saldos de cada persona
- Los saldos cerrados se usan como referencia para el mes siguiente
- Confirmación con resumen antes de cerrar

---

## Configuración (de AppGastos)
- **Nombres**: nombre de cada miembro (default: Vicente, Irene)
- **Sueldos base**: sueldo de cada miembro (legacy, para cálculos de aportación)
- **Porcentaje de aportación**: % que cada uno aporta a cuenta conjunta
- **Objetivo hipoteca**: cantidad objetivo para ahorro de piso
- **Saldo cuenta conjunta**: saldo inicial legacy
- **Penalizaciones**: tipo (dinero/tarea) y cantidad por tarea vencida
- **Saldos iniciales**: fecha + saldo físico/digital por persona y conjunta
- **Config compra piso**: todos los parámetros de la calculadora
- **Info pareja**: estado de vinculación, código de invitación

---

## Autenticación (de AppGastos)
- **Firebase Auth** con email/password (AppGastos actual)
- **Migrar a Supabase Auth** con Magic Link en App de Pus
- **Sistema de Hogares**:
  - Crear nuevo hogar (asociado al usuario)
  - Generar código de invitación (6 caracteres, 24h validez)
  - Unirse a hogar con código
  - Máximo 2 miembros por hogar
- **Documento de usuario** → referencia al hogar

---

## Stack Técnico
- **Frontend**: Next.js 15 + React 19 + TailwindCSS + shadcn/ui
- **Backend/DB**: Supabase (Auth + PostgreSQL + Storage + Realtime)
- **IA/OCR**: Google Gemini 2.0 Flash (gratis, API key)
- **Hosting**: Vercel (free tier)
- **Mobile**: PWA (Mobile First, installable)
- **Charts**: Recharts (React charting library)
- **Export**: xlsx/SheetJS para export a Excel

---

## Datos sincronizados en tiempo real
Colecciones que se sincronizan via Realtime entre ambos usuarios:
- ingresos
- gastos
- becas
- tareas
- listaCompra
- eventos
- metas
- pagosRecurrentes
- historialLimpieza
- aportacionesMensuales
- saldosMensuales
- aportacionesConjunta
- config (documento principal del hogar)

---

## No entra en MVP
- Offline mode completo (solo cache básico de PWA)
- Escaneo de código de barras
- Integración con APIs de supermercados
- Recetas con IA generativa (se añaden manualmente)
- Notificaciones push
- Multi-idioma
- Multi-hogar (solo 1 hogar por usuario)

## Requisitos no funcionales
- Mobile First (80% del uso será en el super con móvil)
- Carga rápida (<2s)
- Cámara nativa del navegador (no app nativa)
- Datos compartidos en tiempo real (Supabase Realtime)
- RGPD: datos personales solo de 2 usuarios conocidos
- iOS Safari optimized (PWA standalone mode)
- Dark mode support
- Safe areas (notch, home indicator)

## Prioridad de Features
1. F1 (Compra Inteligente) — core
2. F4+F5 (Gastos+Ingresos) — migración AppGastos
3. F6+F7 (Patrimonio+Conjunta) — migración AppGastos
4. F3 (Menú Semanal)
5. F13 (Tareas Hogar) — migración AppGastos
6. F10+F11 (Metas+Pagos Recurrentes)
7. F12 (Calculadora Piso)
8. F2 (Historial)
9. F8+F9 (Transferencias+Becas)
10. F14+F15 (Gráficos+Export)
11. F16+F17 (Presupuesto+Cierre)
