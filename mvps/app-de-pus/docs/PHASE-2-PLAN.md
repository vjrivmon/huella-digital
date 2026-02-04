# Phase 2: Implementación Finanzas + Tareas Hogar

> **Objetivo:** Migrar todas las funcionalidades de AppGastos a la nueva app, manteniendo diseño Mobile First iOS.

---

## 📋 Resumen de Features a Implementar

| # | Feature | Prioridad | Complejidad |
|---|---------|-----------|-------------|
| 1 | Ingresos (CRUD + vista mensual/anual) | Alta | Media |
| 2 | Gastos (CRUD + vista mensual/anual) | Alta | Media |
| 3 | Balance y Patrimonio | Alta | Alta |
| 4 | Saldos Iniciales (configuración) | Alta | Baja |
| 5 | Cuenta Conjunta | Alta | Media |
| 6 | Transferencias entre cuentas | Media | Baja |
| 7 | Becas/Ayudas (separado de ingresos) | Media | Media |
| 8 | Préstamos entre pareja | Media | Media |
| 9 | Metas de Ahorro | Media | Baja |
| 10 | Calculadora Compra Piso | Media | Media |
| 11 | Tareas del Hogar | Alta | Baja |
| 12 | Gráficos (evolución, distribución) | Baja | Media |
| 13 | Export (JSON backup) | Baja | Baja |

---

## 🗄️ Schema de Base de Datos (Actualizaciones)

### Tablas nuevas necesarias:

```sql
-- Becas (separado de ingresos normales)
CREATE TABLE becas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id) ON DELETE CASCADE,
  concepto TEXT NOT NULL,
  importe INTEGER NOT NULL,  -- céntimos
  persona pagador NOT NULL,  -- m1 o m2
  estado TEXT NOT NULL DEFAULT 'pendiente',  -- pendiente, mensual, cobrada
  num_pagos INTEGER DEFAULT 1,
  fecha_cobro DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Préstamos entre pareja
CREATE TABLE prestamos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id) ON DELETE CASCADE,
  de_quien pagador NOT NULL,  -- quién presta
  a_quien pagador NOT NULL,   -- quién recibe
  importe INTEGER NOT NULL,
  concepto TEXT,
  pagado BOOLEAN NOT NULL DEFAULT false,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_pago DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Metas de ahorro
CREATE TABLE metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  objetivo INTEGER NOT NULL,  -- céntimos
  actual INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#7D8B74',
  fecha_limite DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tareas del hogar
CREATE TABLE tareas_hogar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  icono TEXT NOT NULL,
  frecuencia_dias INTEGER NOT NULL,
  ultima_vez TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Historial de tareas completadas
CREATE TABLE tareas_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES tareas_hogar(id) ON DELETE CASCADE,
  completada_por UUID REFERENCES profiles(id),
  completada_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuración del hogar (ampliar)
-- Ya existe 'hogares.config' como JSONB, ahí guardaremos:
-- - saldos_iniciales: { fecha, irene: {fisico, digital}, vicente: {fisico, digital}, conjunta: {fisico, digital} }
-- - compra_piso: { precio, tipo, menor35, financiacion, tin, plazo, ingresos, muebles, colchon }
-- - nombres: { m1: "Vicente", m2: "Irene" }
```

### Modificaciones a tablas existentes:

```sql
-- Añadir tipo_ingreso (Fijo/Variable) a ingresos
ALTER TABLE ingresos ADD COLUMN es_fijo BOOLEAN NOT NULL DEFAULT false;

-- Añadir campo para becas que se convierten en ingresos
ALTER TABLE ingresos ADD COLUMN beca_id UUID REFERENCES becas(id);
```

---

## 📱 Diseño UI — Estructura de Navegación

### Tab Finanzas (reorganizado)

```
/finanzas
├── Segmented Control: [Balance] [Ingresos] [Gastos] [Más]
│
├── Balance (default)
│   ├── Card: Balance Pareja (quién debe a quién)
│   ├── Card: Patrimonio Total (Irene + Vicente + Conjunta)
│   ├── Resumen mes actual (ingresos - gastos)
│   └── Saldos por persona (físico + digital)
│
├── Ingresos
│   ├── Filtro: Mes/Año (selector)
│   ├── Resumen: Total mes (físico + digital)
│   ├── Lista agrupada por persona
│   │   └── Items con: concepto, categoría, importe, F/D badge
│   └── FAB: + Añadir ingreso
│
├── Gastos
│   ├── Filtro: Mes/Año (selector)
│   ├── Resumen: Total mes (físico + digital)
│   ├── Lista agrupada por persona
│   │   └── Items con: concepto, categoría, importe, F/D badge
│   └── FAB: + Añadir gasto
│
└── Más (lista de opciones)
    ├── Cuenta Conjunta → /finanzas/conjunta
    ├── Préstamos → /finanzas/prestamos
    ├── Becas/Ayudas → /finanzas/becas
    ├── Metas de Ahorro → /finanzas/metas
    ├── Calculadora Piso → /finanzas/calculadora
    ├── Histórico Anual → /finanzas/historico
    └── Configuración Saldos → /finanzas/config
```

### Home (actualizado)

```
/home
├── Header: Saludo + fecha + ⚙️ settings
├── Card: Balance Pareja (resumen)
├── Card: Presupuesto Mes (progress bar)
├── Quick Actions (2×2 grid)
│   ├── Nueva compra
│   ├── Añadir gasto
│   ├── Añadir ingreso
│   └── Escanear precio
├── Tareas del Hogar  ← NUEVO
│   ├── Título + ver todas →
│   ├── Lista horizontal de tareas con estado
│   │   └── Cada tarea: icono + nombre + estado (OK/Warning/Overdue)
│   └── Tap para marcar como hecha
└── Menú de Hoy (si hay planificado)
```

---

## 🎨 Componentes UI a Crear (iOS HIG)

### 1. Formularios de Entrada

**IngresoForm / GastoForm:**
```
┌─────────────────────────────────────┐
│ ← Nuevo Ingreso              [Guardar]
├─────────────────────────────────────┤
│                                     │
│  Importe                            │
│  ┌─────────────────────────────┐   │
│  │  € 0,00           [teclado] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─── Detalles ────────────────────  │
│  ┌─────────────────────────────┐   │
│  │ Concepto              [___] │   │
│  │─────────────────────────────│   │
│  │ Categoría             Nómina >│  │
│  │─────────────────────────────│   │
│  │ Persona               Vicente>│  │
│  │─────────────────────────────│   │
│  │ Tipo dinero           Digital>│  │
│  │─────────────────────────────│   │
│  │ Tipo ingreso          Fijo   >│  │
│  │─────────────────────────────│   │
│  │ Fecha               03/02/26 >│  │
│  └─────────────────────────────┘   │
│                                     │
│  Notas (opcional)                   │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 2. Lista de Transacciones (Grouped List iOS style)

```
┌─────────────────────────────────────┐
│ 👨 Vicente                          │
├─────────────────────────────────────┤
│ 💼 Nómina              +4.681,44€  │
│    Digital · Fijo         03 feb   │
│─────────────────────────────────────│
│ 💰 Freelance              +200,00€ │
│    Efectivo · Variable    15 feb   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👩 Irene                            │
├─────────────────────────────────────┤
│ 💼 Nómina                  +49,00€ │
│    Digital · Fijo         01 feb   │
└─────────────────────────────────────┘
```

### 3. Tareas del Hogar (Scroll horizontal)

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  🍳  │ │  🗑️  │ │  🧹  │ │  🛁  │
│Cocina│ │Basura│ │Suelos│ │ Baño │
│ ✅   │ │ ⚠️   │ │ 🔴   │ │ ✅   │
│ hoy  │ │ 1día │ │ 3d!  │ │ 2d   │
└──────┘ └──────┘ └──────┘ └──────┘
  OK     Warning  Overdue    OK
```

Estados:
- ✅ OK (verde): dentro de frecuencia
- ⚠️ Warning (amarillo): ≤1 día para vencer
- 🔴 Overdue (rojo): vencida

### 4. Balance Card

```
┌─────────────────────────────────────┐
│ 💰 Balance Pareja                   │
│                                     │
│      Irene debe                     │
│      23,50€                         │
│      a Vicente                      │
│                                     │
│  [Liquidar]              [Detalle →]│
└─────────────────────────────────────┘
```

### 5. Patrimonio Card

```
┌─────────────────────────────────────┐
│ 🏦 Patrimonio Total     55.104,56€ │
├─────────────────────────────────────┤
│ Irene      │ F: 3.000 │ D: 9.759  │
│ Vicente    │ F: 15    │ D: 40.330 │
│ Conjunta   │ F: 0     │ D: 2.000  │
└─────────────────────────────────────┘
```

### 6. Selector Mes/Año

```
┌─────────────────────────────────────┐
│  ←  │    Febrero 2026    │  →      │
└─────────────────────────────────────┘
```

---

## 📁 Archivos a Crear

### Páginas:
```
src/app/
├── (tabs)/
│   ├── home/page.tsx          # Actualizar con Tareas
│   └── finanzas/
│       ├── page.tsx           # Actualizar con tabs funcionales
│       ├── conjunta/page.tsx  # NUEVO
│       ├── prestamos/page.tsx # NUEVO
│       ├── becas/page.tsx     # NUEVO
│       ├── metas/page.tsx     # NUEVO
│       ├── calculadora/page.tsx # NUEVO
│       ├── historico/page.tsx # NUEVO
│       └── config/page.tsx    # NUEVO (saldos iniciales)
├── settings/page.tsx          # NUEVO
└── api/
    └── ... (si necesitamos server actions)
```

### Componentes:
```
src/components/
├── finanzas/
│   ├── ingreso-form.tsx       # Sheet para añadir/editar
│   ├── gasto-form.tsx
│   ├── transaccion-list.tsx   # Lista agrupada
│   ├── transaccion-item.tsx   # Item individual
│   ├── balance-card.tsx
│   ├── patrimonio-card.tsx
│   ├── mes-selector.tsx       # Navegación mes/año
│   ├── categoria-picker.tsx   # Selector de categoría
│   ├── persona-picker.tsx     # Selector Vicente/Irene
│   ├── prestamo-form.tsx
│   ├── prestamo-item.tsx
│   ├── beca-form.tsx
│   ├── beca-item.tsx
│   ├── meta-card.tsx
│   ├── meta-form.tsx
│   └── calculadora-piso.tsx   # Formulario completo
├── tareas/
│   ├── tareas-carousel.tsx    # Scroll horizontal
│   ├── tarea-chip.tsx         # Chip individual
│   └── tarea-detail-sheet.tsx # Sheet al hacer tap
└── ui/
    ├── numeric-input.tsx      # Input para dinero (céntimos)
    ├── grouped-list.tsx       # Lista estilo iOS Settings
    ├── segment-control.tsx    # Ya existe, verificar
    └── month-picker.tsx       # Picker de mes
```

### Hooks:
```
src/hooks/
├── use-ingresos.ts        # CRUD + filtros
├── use-gastos.ts          # CRUD + filtros
├── use-balance.ts         # Cálculos de balance
├── use-patrimonio.ts      # Cálculos de patrimonio
├── use-prestamos.ts       # CRUD préstamos
├── use-becas.ts           # CRUD becas
├── use-metas.ts           # CRUD metas
├── use-tareas.ts          # CRUD tareas + estado
├── use-config-hogar.ts    # Configuración del hogar
└── use-calculadora.ts     # Lógica calculadora piso
```

### Tipos:
```
src/types/
├── finanzas.ts            # Ingreso, Gasto, Balance, etc.
├── tareas.ts              # Tarea, TareaHistorial
└── config.ts              # ConfigHogar, SaldosIniciales
```

---

## 📊 Orden de Implementación

### Sprint 1: Base (2-3 días)
1. ✅ Actualizar schema Supabase (migration 002)
2. ✅ Crear tipos TypeScript
3. ✅ Crear hooks base (use-ingresos, use-gastos)
4. ✅ Componentes UI base (numeric-input, grouped-list, segment-control)

### Sprint 2: Ingresos + Gastos (2-3 días)
1. ✅ Página /finanzas con tabs funcionales
2. ✅ Tab Ingresos: lista + filtro mes + form añadir
3. ✅ Tab Gastos: lista + filtro mes + form añadir
4. ✅ Swipe to delete en items

### Sprint 3: Balance + Patrimonio (1-2 días)
1. ✅ Tab Balance completo
2. ✅ Cálculo automático balance pareja
3. ✅ Cálculo patrimonio (físico + digital)
4. ✅ Página config saldos iniciales

### Sprint 4: Cuenta Conjunta + Transferencias (1-2 días)
1. ✅ Página /finanzas/conjunta
2. ✅ Aportaciones a conjunta
3. ✅ Transferencias entre cuentas

### Sprint 5: Becas + Préstamos + Metas (2 días)
1. ✅ Página /finanzas/becas
2. ✅ Página /finanzas/prestamos
3. ✅ Página /finanzas/metas

### Sprint 6: Calculadora + Histórico (1-2 días)
1. ✅ Página /finanzas/calculadora
2. ✅ Página /finanzas/historico (vista anual)

### Sprint 7: Tareas Hogar + Home (1-2 días)
1. ✅ Componentes tareas
2. ✅ Integrar en Home
3. ✅ Página /settings

### Sprint 8: Polish + Gráficos (1-2 días)
1. ✅ Gráficos con Recharts
2. ✅ Export JSON
3. ✅ Testing y ajustes

---

## ⏱️ Estimación Total

| Sprint | Días | Acumulado |
|--------|------|-----------|
| 1. Base | 2-3 | 2-3 |
| 2. Ingresos+Gastos | 2-3 | 4-6 |
| 3. Balance+Patrimonio | 1-2 | 5-8 |
| 4. Conjunta+Transfer | 1-2 | 6-10 |
| 5. Becas+Préstamos+Metas | 2 | 8-12 |
| 6. Calculadora+Histórico | 1-2 | 9-14 |
| 7. Tareas+Home+Settings | 1-2 | 10-16 |
| 8. Polish+Gráficos | 1-2 | 11-18 |

**Total estimado: 11-18 días de desarrollo**

---

## ❓ Puntos Pendientes de Confirmación

1. **Nombres configurables:** ¿"Vicente" e "Irene" son fijos o quieres poder cambiarlos en settings?

2. **12 Tareas fijas:** ¿Son siempre las mismas o el usuario puede añadir/quitar?
   - Salón (7d), Cocina (3d), Baño (5d), Dormitorio (7d)
   - Basura (2d), Lavadora (3d), Tender (3d), Planchar (7d)
   - Suelos (5d), Polvo (7d), Cristales (14d), Nevera (14d)

3. **Liquidar balance:** ¿Cómo funciona? ¿Crea una transferencia automática?

4. **Gráficos:** ¿Qué gráficos son imprescindibles?
   - Evolución patrimonio (últimos 6-12 meses)
   - Distribución gastos por categoría
   - Ingresos vs Gastos mensual
   - ¿Otros?

---

**¿Apruebas este plan o quieres modificar algo antes de empezar?** 🧠
