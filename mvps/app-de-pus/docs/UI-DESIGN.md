# UI Design — App de Pus

> iOS Human Interface Guidelines compliant · PWA · Mobile First
> San Francisco font family · 375×812 reference (iPhone 13/14/15)

---

## Design System

### Color System
```
Primary Accent:     #7D8B74 (Sage Green — calm, financial)
Secondary:          #C17B6E (Warm Terracotta — alerts, expenses)
Positive:           #34C759 (iOS Green — income, success)
Negative:           #FF3B30 (iOS Red — expenses, warnings)
Warning:            #FF9500 (iOS Orange — budget alerts)

Background:         #F2F2F7 (iOS System Gray 6)
Surface:            #FFFFFF (cards)
Text Primary:       #1C1C1E
Text Secondary:     #8E8E93
Text Muted:         #AEAEB2
Separator:          #C6C6C8

Dark Mode:
  Background:       #000000
  Surface:          #1C1C1E
  Text Primary:     #FFFFFF
  Text Secondary:   #8E8E93
```

### Typography (SF Pro)
```
Large Title:    34pt Bold
Title 1:        28pt Bold
Title 2:        22pt Bold
Title 3:        20pt Semibold
Headline:       17pt Semibold
Body:           17pt Regular
Callout:        16pt Regular
Subhead:        15pt Regular
Footnote:       13pt Regular
Caption 1:      12pt Regular
Caption 2:      11pt Regular
```

### Spacing
```
xs:   4pt
sm:   8pt
md:   12pt
lg:   16pt
xl:   20pt
2xl:  24pt
3xl:  32pt
```

### Components
```
Card:               radius 12-16pt, shadow subtle
Bottom Tab Bar:     49pt height + safe area
Navigation Bar:     44pt height + safe area
Touch Target:       minimum 44×44pt
Button:             height 50pt, radius 12pt
Input:              height 44pt, radius 10pt
Sheet:              radius 12pt top corners
```

---

## Navigation Architecture

```
┌─────────────────────────────────────┐
│         App de Pus                  │
├─────────────────────────────────────┤
│                                     │
│     ┌──────────────────────┐        │
│     │    Content Area      │        │
│     │    (full screen)     │        │
│     │                      │        │
│     │  ← Swipe Right: Back │        │
│     │  ← Swipe Left (Home):│        │
│     │    Opens Camera       │        │
│     └──────────────────────┘        │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home │ 🛒 Compra │ 📋 Menú │ 💰 │
│          │           │         │Fin.│
└─────────────────────────────────────┘
    49pt + env(safe-area-inset-bottom)
```

### Tab Structure
| Tab | Icon | Label | Primary Content |
|-----|------|-------|----------------|
| 1 | 🏠 | Home | Dashboard, quick actions |
| 2 | 🛒 | Compra | Lista de compra, modo compra |
| 3 | 📋 | Menú | Menu semanal, recetas |
| 4 | 💰 | Finanzas | Todo lo financiero |

### Sub-navigation
- **Finanzas**: Segmented control → Balance | Ingresos | Gastos | Patrimonio | Más
- **Más (Finanzas)**: Cuenta Conjunta, Préstamos, Metas, Calculadora
- **Settings**: Accessible from Home → avatar/gear icon top-right
- **Camera**: Swipe left from Home OR button in Compra

---

## Screen 1: 🏠 Home (Dashboard)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  Hola, Vicente 👋     ⚙️         ║
║  Martes, 3 de febrero             ║
║                                   ║
╠═══════════════════════════════════╣
║  ┌─────────────────────────────┐  ║
║  │ 💰 Balance Pareja           │  ║
║  │                              │  ║
║  │  Irene debe  23,50€         │  ║
║  │  a Vicente                   │  ║
║  │                              │  ║
║  │  [Ver detalle →]             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 📊 Presupuesto Febrero       │  ║
║  │                              │  ║
║  │  ████████████░░░░░  67%      │  ║
║  │  1.340€ / 2.000€             │  ║
║  │  Quedan: 660€                │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Quick Actions                    ║
║  ┌──────────┐ ┌──────────────┐   ║
║  │ 🛒       │ │ 💸           │   ║
║  │ Nueva    │ │ Añadir       │   ║
║  │ compra   │ │ gasto        │   ║
║  └──────────┘ └──────────────┘   ║
║  ┌──────────┐ ┌──────────────┐   ║
║  │ 💰       │ │ 📸           │   ║
║  │ Añadir   │ │ Escanear     │   ║
║  │ ingreso  │ │ precio       │   ║
║  └──────────┘ └──────────────┘   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🏠 Tareas del hogar         │  ║
║  │                              │  ║
║  │  ⚠️ 2 tareas vencidas       │  ║
║  │  🍳 Cocina — hace 4 días    │  ║
║  │  🗑️ Basura — hace 3 días    │  ║
║  │                              │  ║
║  │  [Ver todas →]               │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 📋 Menú de hoy              │  ║
║  │                              │  ║
║  │  🍽️ Comida: Pasta boloñesa  │  ║
║  │  🌙 Cena:   Ensalada César  │  ║
║  │                              │  ║
║  │  [Ver semana →]              │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ← Swipe left para cámara rápida ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
║  Home  Compra  Menú   Finanzas   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

### Interactions
- **Pull to refresh**: Reloads all data
- **Swipe left**: Opens camera for quick price scan
- **Tap card**: Navigates to respective section
- **Quick actions**: 2×2 grid of primary actions
- **Balance card**: Tap → Finanzas tab, Balance section
- **Presupuesto card**: Tap → Finanzas tab, Presupuesto section

---

## Screen 2: 🛒 Compra — Lista (Borrador)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  Lista de Compra          [···]  ║
║                                   ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🔍 Añadir producto...    [+]│  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Productos frecuentes:            ║
║  ┌─────┐┌──────┐┌──────┐┌────┐  ║
║  │+Leche││+Pan  ││+Huev ││+Tom│  ║
║  └─────┘└──────┘└──────┘└────┘  ║
║  ┌──────┐┌───────┐┌──────────┐   ║
║  │+Aceite││+Cebolla││+Papel hig│  ║
║  └──────┘└───────┘└──────────┘   ║
║                                   ║
║  ─── 🥬 Frescos ──────────────   ║
║  ☐ Tomates           2 ud    ≡   ║
║  ☐ Lechuga           1 ud    ≡   ║
║  ☐ Cebolla           3 ud    ≡   ║
║                                   ║
║  ─── 🥩 Carnicería ───────────   ║
║  ☐ Pollo             1 kg    ≡   ║
║  ☐ Ternera picada    500g    ≡   ║
║                                   ║
║  ─── 🥛 Lácteos ──────────────   ║
║  ☐ Leche entera      2 L     ≡   ║
║  ☐ Yogures           pack    ≡   ║
║                                   ║
║  ─── 🧴 Limpieza ─────────────   ║
║  ☐ Detergente        1 ud    ≡   ║
║                                   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │     🛒 Empezar Compra       │  ║
║  │     Mercadona · 100€        │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  [🗑️ Limpiar comprados]          ║
║  [📤 Compartir lista]            ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
║  Home  Compra  Menú   Finanzas   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

### Interactions
- **Add product**: Text input + Enter, or tap frequent product chip
- **Drag handle (≡)**: Reorder products within category
- **Swipe left on product**: Delete
- **Tap product**: Edit name/quantity/category
- **"Empezar Compra"**: Sheet opens to set supermercado + presupuesto → transitions to modo compra
- **[···] menu**: New list, History, Settings

---

## Screen 2b: 🛒 Compra — Modo Compra (en el super)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  🛒 Mercadona         [Finalizar]║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │  37,50€ / 100,00€           │  ║
║  │  ████████████░░░░░░░  37.5% │  ║
║  │  Quedan: 62,50€             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║                                   ║
║  ✅ Leche entera              1,15║
║  ✅ Pan de molde              0,85║
║  ✅ Tomates                   2,30║
║  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ║
║  ☐ Huevos                     --- ║
║  ☐ Pollo                     --- ║
║  ☐ Ternera picada            --- ║
║  ☐ Lechuga                   --- ║
║  ☐ Cebolla                   --- ║
║  ☐ Yogures                   --- ║
║  ☐ Detergente                --- ║
║                                   ║
║  + Añadir producto                ║
║                                   ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │              │ │             │ ║
║  │   📸 Foto   │ │  ✏️ Manual  │ ║
║  │   precio    │ │  precio     │ ║
║  │              │ │             │ ║
║  └─────────────┘ └─────────────┘ ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

**Note**: Bottom tab bar is HIDDEN during modo compra for maximum screen space.

### Interactions
- **Tap unchecked product**: Selects it (highlighted border)
- **📸 Foto**: Opens camera → capture → OCR → confirms price → checks product
- **✏️ Manual**: Opens numeric keypad sheet → type price → confirm → checks product
- **Progress bar**: Updates in real-time, turns orange at 80%, red at 100%
- **Haptic feedback**: Vibration when exceeding budget
- **Finalizar**: Confirmation sheet → creates snapshot → option to add as shared expense
- **Swipe down on header**: Collapse to mini progress bar

---

## Screen 2c: 🛒 Compra — Resumen Post-Compra

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  ✅ Compra finalizada             ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │        🎉                    │  ║
║  │                              │  ║
║  │   Total: 87,30€              │  ║
║  │   Presupuesto: 100,00€      │  ║
║  │   Ahorro: 12,70€ 🎯         │  ║
║  │                              │  ║
║  │   8 productos                │  ║
║  │   Mercadona                  │  ║
║  │   3 feb 2026                 │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Productos comprados:             ║
║  ┌─────────────────────────────┐  ║
║  │ Leche entera          1,15€ │  ║
║  │ Pan de molde          0,85€ │  ║
║  │ Tomates               2,30€ │  ║
║  │ Huevos                2,50€ │  ║
║  │ Pollo                 5,80€ │  ║
║  │ Ternera picada        4,20€ │  ║
║  │ Lechuga               1,10€ │  ║
║  │ Yogures               2,40€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 💰 Añadir como gasto        │  ║
║  │    compartido                │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 📤 Compartir resumen        │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  [← Volver a inicio]             ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
║  Home  Compra  Menú   Finanzas   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 3: 📋 Menú — Grid Semanal

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  📋 Menú Semanal           [📖]  ║
║  ◀ Semana 5 (27 ene-2 feb) ▶    ║
║                                   ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌──────┬────────────┬────────┐  ║
║  │      │  🍽️ Comida │ 🌙Cena │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ LUN  │ Pasta      │ Ensala │  ║
║  │      │ boloñesa   │ César  │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ MAR  │ Lentejas   │ Torti- │  ║
║  │      │            │ lla    │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ MIÉ  │ ┈ vacío ┈  │ ┈ ┈ ┈ │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ JUE  │ ┈ vacío ┈  │ ┈ ┈ ┈ │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ VIE  │ ┈ vacío ┈  │ ┈ ┈ ┈ │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ SÁB  │ ┈ vacío ┈  │ ┈ ┈ ┈ │  ║
║  ├──────┼────────────┼────────┤  ║
║  │ DOM  │ ┈ vacío ┈  │ ┈ ┈ ┈ │  ║
║  └──────┴────────────┴────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │  🛒 Generar lista de compra │  ║
║  │  Coste estimado: ~65€       │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
║  Home  Compra  Menú   Finanzas   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

### Interactions
- **Tap empty slot**: Bottom sheet with recipe search + quick add
- **Tap filled slot**: Options sheet (change recipe, add note, clear)
- **◀ ▶**: Navigate weeks (past = read-only)
- **[📖]**: Opens Recetas list
- **"Generar lista"**: Preview sheet → confirms → creates lista borrador in Compra tab
- **Horizontal swipe**: Navigate weeks

---

## Screen 3b: 📋 Menú — Asignar Receta (Bottom Sheet)

```
╔═══════════════════════════════════╗
║                                   ║
║  (dimmed background)              ║
║                                   ║
║                                   ║
╠═══════════════════════════════════╣
║  ─── (grab indicator) ───        ║
║                                   ║
║  Miércoles — Comida               ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🔍 Buscar receta...         │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Recientes:                       ║
║  ┌─────────────────────────────┐  ║
║  │ 🍝 Pasta boloñesa    30min  │  ║
║  │ 🥗 Ensalada César    15min  │  ║
║  │ 🍲 Lentejas          45min  │  ║
║  │ 🥚 Tortilla española 20min  │  ║
║  │ 🐟 Salmón plancha    25min  │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ + Nueva receta               │  ║
║  └─────────────────────────────┘  ║
║  ┌─────────────────────────────┐  ║
║  │ ✏️ Nota libre (sin receta)   │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4: 💰 Finanzas — Main (Balance)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║                                   ║
║  💰 Finanzas                     ║
║                                   ║
║  ┌───────┬────────┬──────┬────┐  ║
║  │Balance│Ingresos│Gastos│ Más│  ║
║  └───────┴────────┴──────┴────┘  ║
║  (segmented control)              ║
║                                   ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👫 Balance de Pareja        │  ║
║  │                              │  ║
║  │  Irene debe                  │  ║
║  │  23,50€                      │  ║
║  │  a Vicente                   │  ║
║  │                              │  ║
║  │  ┌───────────┐               │  ║
║  │  │💸 Ajustar │               │  ║
║  │  └───────────┘               │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Febrero 2026              ◀ ▶   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 📊 Patrimonio               │  ║
║  │                              │  ║
║  │ 👨 Vicente    43,82€        │  ║
║  │    F: 15€  D: 28,82€       │  ║
║  │                              │  ║
║  │ 👩 Irene   13.898,10€      │  ║
║  │    F: 3.000€ D: 10.898€    │  ║
║  │                              │  ║
║  │ 🏦 Conjunta  2.000,00€     │  ║
║  │                              │  ║
║  │ Total: 15.941,92€           │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 📊 Presupuesto mensual      │  ║
║  │ ████████████░░░░░░░  67%    │  ║
║  │ 1.340€ / 2.000€             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Últimos gastos:                  ║
║  ┌─────────────────────────────┐  ║
║  │ 🛒 Mercadona       -87,00€ │  ║
║  │    28 ene · Vicente         │  ║
║  │ 🚗 Gasolina        -45,00€ │  ║
║  │    25 ene · Irene           │  ║
║  │ 🍽️ Cena fuera      -32,00€ │  ║
║  │    23 ene · Vicente         │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ + Nuevo gasto    + Ingreso  │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
║  Home  Compra  Menú   Finanzas   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4b: 💰 Finanzas — Ingresos (tab)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  💰 Finanzas                     ║
║  ┌───────┬────────┬──────┬────┐  ║
║  │Balance│▌Ingres▐│Gastos│ Más│  ║
║  └───────┴────────┴──────┴────┘  ║
╠═══════════════════════════════════╣
║                                   ║
║  Febrero 2026              ◀ ▶   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👨 Vicente         +881,19€ │  ║
║  │                              │  ║
║  │ 💼 Nómina      D   +881,19€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👩 Irene           +293,44€ │  ║
║  │                              │  ║
║  │ 💼 Nómina      D   +293,44€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Total ingresos: +1.174,63€      ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │      + Añadir ingreso        │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4c: 💰 Finanzas — Gastos (tab)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  💰 Finanzas                     ║
║  ┌───────┬────────┬──────┬────┐  ║
║  │Balance│Ingresos│▌Gast▐│ Más│  ║
║  └───────┴────────┴──────┴────┘  ║
╠═══════════════════════════════════╣
║                                   ║
║  Febrero 2026              ◀ ▶   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👨 Vicente         -450,00€ │  ║
║  │                              │  ║
║  │ 🏠 Alquiler    D   -350,00€ │  ║
║  │ 🛒 Supermercado D    -87,00€│  ║
║  │ 🍽️ Ocio        D    -13,00€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👩 Irene           -280,00€ │  ║
║  │                              │  ║
║  │ 🏠 Alquiler    D   -200,00€ │  ║
║  │ 🚗 Transporte  D    -45,00€ │  ║
║  │ 💊 Salud       D    -35,00€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🏦 Conjunta        -120,00€ │  ║
║  │                              │  ║
║  │ 💡 Suministros D    -80,00€ │  ║
║  │ 📱 Internet    D    -40,00€ │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Total gastos: -850,00€           ║
║                                   ║
║  📊 Distribución por categoría:   ║
║  ┌─────────────────────────────┐  ║
║  │ 🏠 Alquiler    65% ████████ │  ║
║  │ 🛒 Super       10% ██       │  ║
║  │ 💡 Suminist.    9% ██       │  ║
║  │ 🚗 Transporte   5% █        │  ║
║  │ 📱 Internet     5% █        │  ║
║  │ 💊 Salud        4% █        │  ║
║  │ 🍽️ Ocio         2% ▌        │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │      + Añadir gasto          │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4d: 💰 Finanzas — Más (Expandido)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  💰 Finanzas                     ║
║  ┌───────┬────────┬──────┬────┐  ║
║  │Balance│Ingresos│Gastos│▌Más▐│  ║
║  └───────┴────────┴──────┴────┘  ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │ 🏦           │ │ 🤝          │ ║
║  │ Cuenta       │ │ Préstamos   │ ║
║  │ Conjunta     │ │             │ ║
║  └─────────────┘ └─────────────┘ ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │ 🎯           │ │ 📺          │ ║
║  │ Metas de     │ │ Pagos       │ ║
║  │ ahorro       │ │ recurrentes │ ║
║  └─────────────┘ └─────────────┘ ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │ 🏠           │ │ 🎓          │ ║
║  │ Calculadora  │ │ Becas /     │ ║
║  │ hipoteca     │ │ Ayudas      │ ║
║  └─────────────┘ └─────────────┘ ║
║  ┌─────────────┐ ┌─────────────┐ ║
║  │ 📊           │ │ 📤          │ ║
║  │ Gráficos     │ │ Exportar    │ ║
║  │              │ │ datos       │ ║
║  └─────────────┘ └─────────────┘ ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4e: 💰 Metas de Ahorro (sub-page)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Metas de ahorro       [+ ]   ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🏠 Entrada piso             │  ║
║  │ ████████████████░░  80%     │  ║
║  │ 24.000€ / 30.000€           │  ║
║  │ Faltan 127 días          [+]│  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ ✈️ Viaje Japón              │  ║
║  │ ██████░░░░░░░░░░░░  33%    │  ║
║  │ 1.000€ / 3.000€             │  ║
║  │ Sin fecha límite         [+]│  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 💻 PC nuevo                  │  ║
║  │ ████████████████████ 100%   │  ║
║  │ 1.500€ / 1.500€  ✅         │  ║
║  │ ¡Completada!                 │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4f: 💰 Calculadora Hipoteca (sub-page)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Calculadora Hipoteca          ║
╠═══════════════════════════════════╣
║                                   ║
║  Precio vivienda                  ║
║  ┌─────────────────────────────┐  ║
║  │ 299.000€                     │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Tipo: [Obra nueva ▼]            ║
║  ☑ Menor de 35 años              ║
║                                   ║
║  Financiación: 80%               ║
║  ──●──────────────────── 50-100  ║
║                                   ║
║  TIN: 3%    Plazo: 30 años       ║
║  ──●──────── ──────●──────       ║
║                                   ║
║  Ingresos netos/mes: 3.000€      ║
║                                   ║
╠═══════════ RESULTADOS ════════════╣
║                                   ║
║  Impuestos (IVA+AJD)   34.385€  ║
║  Notaría+Reg+Gestoría   5.980€  ║
║  Tasación                  400€  ║
║  ──────────────────────────────   ║
║  Total gastos compra    40.765€  ║
║                                   ║
║  Hipoteca              239.200€  ║
║  Entrada                59.800€  ║
║  ──────────────────────────────   ║
║  Cuota mensual          1.008€   ║
║  Ratio endeudamiento    33,6%    ║
║  ⚠️ Cercano al límite (35%)      ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ TOTAL NECESARIO  103.565€   │  ║
║  │ Patrimonio       15.942€    │  ║
║  │ FALTA            87.623€    │  ║
║  │ ██░░░░░░░░░░░░░  15.4%     │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 4g: 💰 Cuenta Conjunta (sub-page)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Cuenta Conjunta               ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌──────┐┌───────┐┌──────┐┌───┐ ║
║  │Saldo ││Entrad.││Gastos││Sal.│ ║
║  │Inic. ││      ││      ││Act.│ ║
║  │2.000€││+850€ ││-420€ ││2.4k│ ║
║  └──────┘└───────┘└──────┘└───┘ ║
║                                   ║
║  2026                      ◀ ▶   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ Ene  Feb  Mar  ...         →│  ║
║  │                              │  ║
║  │👨 Aport.  400  450  ---     │  ║
║  │👩 Aport.  300  300  ---     │  ║
║  │✨ Otros     0    0  ---     │  ║
║  │💸 Gastos -220 -200  ---     │  ║
║  │──────────────────────────── │  ║
║  │🏦 Saldo 2.480 3.030  ---   │  ║
║  └─────────────────────────────┘  ║
║  (horizontal scroll table)        ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ + Registrar aportación       │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  💡 Para aportar a la conjunta,   ║
║  usa "+ Añadir" en Ingresos con   ║
║  destinatario "Cuenta Conjunta"   ║
║  o crea una Transferencia.        ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 5: 📸 Camera (Swipe from Home / Compra button)

```
╔═══════════════════════════════════╗
║                                   ║
║                                   ║
║                                   ║
║                                   ║
║        (FULLSCREEN CAMERA)        ║
║                                   ║
║        ┌──────────────────┐       ║
║        │                  │       ║
║        │  Apunta al       │       ║
║        │  precio          │       ║
║        │                  │       ║
║        │   [ 1,15€ ]     │       ║
║        │   (viewfinder)   │       ║
║        │                  │       ║
║        └──────────────────┘       ║
║                                   ║
║                                   ║
║                                   ║
║                                   ║
║                                   ║
║  ┌──────────────────────────────┐ ║
║  │                              │ ║
║  │   [✕]    ( ◉ )    [⟳]      │ ║
║  │  cerrar  capture  flip cam   │ ║
║  │                              │ ║
║  └──────────────────────────────┘ ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

### After Capture — Confirm Price (Sheet)

```
╔═══════════════════════════════════╗
║                                   ║
║  (camera preview frozen)          ║
║                                   ║
╠═══════════════════════════════════╣
║  ─── (grab indicator) ───        ║
║                                   ║
║  Precio detectado:                ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │         1,15€                │  ║
║  │     (editable field)         │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Producto: [Leche entera ▼]      ║
║  (auto-select from active list)   ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │     ✅ Confirmar y añadir    │  ║
║  └─────────────────────────────┘  ║
║  ┌─────────────────────────────┐  ║
║  │     📸 Repetir foto          │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 6: ⚙️ Settings / Perfil

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Ajustes                       ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 👤 Perfil                    │  ║
║  │                              │  ║
║  │ vicente@email.com            │  ║
║  │ Hogar compartido con Irene   │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ─── Hogar ──────────────────    ║
║  ┌─────────────────────────────┐  ║
║  │ Nombre Miembro 1   Vicente  │  ║
║  │ Nombre Miembro 2   Irene    │  ║
║  │ Invitar pareja        [→]   │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ─── Saldos Iniciales ──────    ║
║  ┌─────────────────────────────┐  ║
║  │ Fecha referencia  11/01/26  │  ║
║  │ Vicente Físico      15,00€  │  ║
║  │ Vicente Digital     28,82€  │  ║
║  │ Irene Físico     3.000,00€  │  ║
║  │ Irene Digital   10.898,10€  │  ║
║  │ Conjunta Físico     0,00€   │  ║
║  │ Conjunta Digital 2.000,00€  │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ─── Presupuesto ───────────    ║
║  ┌─────────────────────────────┐  ║
║  │ Presupuesto mensual  2.000€ │  ║
║  │ Alerta 80%          ☑       │  ║
║  │ Alerta 100%         ☑       │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ─── Apariencia ─────────────    ║
║  ┌─────────────────────────────┐  ║
║  │ Modo oscuro     [🌙 toggle] │  ║
║  │ Color acento    [●  picker] │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ─── Datos ──────────────────    ║
║  ┌─────────────────────────────┐  ║
║  │ Exportar JSON          [↗]  │  ║
║  │ Exportar Excel mes     [↗]  │  ║
║  │ Exportar Excel anual   [↗]  │  ║
║  │ Importar datos         [↗]  │  ║
║  │ ⚠️ Borrar todos datos  [→]  │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🚪 Cerrar sesión            │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  App de Pus v1.0.0                ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 7: 🏠 Tareas del Hogar (from Home card)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Tareas del Hogar  ⚠️ 2 venc. ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ 🍳 Cocina        ⚠️ VENCIDA │  ║
║  │ Hace 4 días · cada 3 días   │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ 🗑️ Basura        ⚠️ VENCIDA │  ║
║  │ Hace 3 días · cada 2 días   │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ 🛋️ Salón          ⏳ Mañana │  ║
║  │ Hace 6 días · cada 7 días   │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ 🚿 Baño           ✅ OK     │  ║
║  │ Hace 2 días · cada 5 días   │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ 🛏️ Dormitorio     ✅ OK     │  ║
║  │ Hace 3 días · cada 7 días   │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ 🫧 Lavadora       ✅ OK     │  ║
║  │ Hace 1 día · cada 3 días    │  ║
║  │                     [✓Hecho]│  ║
║  ├─────────────────────────────┤  ║
║  │ ... (more items)             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Historial reciente:              ║
║  🍳 Cocina — hace 4 días         ║
║  🗑️ Basura — hace 3 días         ║
║  🚿 Baño — hace 2 días           ║
║  🫧 Lavadora — ayer              ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 8: Nuevo Gasto (Modal Sheet)

```
╔═══════════════════════════════════╗
║                                   ║
║  (dimmed background)              ║
║                                   ║
╠═══════════════════════════════════╣
║  ─── (grab indicator) ───        ║
║                                   ║
║  Nuevo Gasto          [Cancelar] ║
║                                   ║
║  Importe                          ║
║  ┌─────────────────────────────┐  ║
║  │          87,00€              │  ║
║  │     (large numeric input)    │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Concepto                         ║
║  ┌─────────────────────────────┐  ║
║  │ Compra semanal               │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Categoría                        ║
║  ┌──────┐┌──────┐┌──────┐┌────┐ ║
║  │🏠Alq ││💡Sum ││📱Net ││🛒Su│ ║
║  └──────┘└──────┘└──────┘└────┘ ║
║  ┌──────┐┌──────┐┌──────┐┌────┐ ║
║  │🚗Tra ││🍽️Ocio││👕Ropa││💊Sa│ ║
║  └──────┘└──────┘└──────┘└────┘ ║
║  ┌──────┐┌──────┐┌──────┐       ║
║  │📺Susc││🤖IA  ││📦Otro│       ║
║  └──────┘└──────┘└──────┘       ║
║                                   ║
║  Pagado por                       ║
║  ┌────────┬────────┬──────────┐  ║
║  │▌Vicente▐│ Irene  │ Conjunta │  ║
║  └────────┴────────┴──────────┘  ║
║                                   ║
║  Tipo: ○ Efectivo  ● Digital     ║
║  Fecha: [3 feb 2026]             ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │        💾 Guardar            │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 9: Nuevo Ingreso (Modal Sheet)

```
╔═══════════════════════════════════╗
║                                   ║
║  (dimmed background)              ║
║                                   ║
╠═══════════════════════════════════╣
║  ─── (grab indicator) ───        ║
║                                   ║
║  Nuevo Ingreso        [Cancelar] ║
║                                   ║
║  Importe                          ║
║  ┌─────────────────────────────┐  ║
║  │          881,19€             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Concepto                         ║
║  ┌─────────────────────────────┐  ║
║  │ Nómina febrero               │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Categoría                        ║
║  ┌──────┐┌──────┐┌──────┐       ║
║  │💼Nóm ││🎁Paga││💰Free│       ║
║  └──────┘└──────┘└──────┘       ║
║  ┌──────┐┌──────┐┌──────┐       ║
║  │🎓Beca││🌑Efec││📦Otro│       ║
║  └──────┘└──────┘└──────┘       ║
║                                   ║
║  Para quién                       ║
║  ┌────────┬────────┬──────────┐  ║
║  │▌Vicente▐│ Irene  │ Conjunta │  ║
║  └────────┴────────┴──────────┘  ║
║                                   ║
║  Tipo: ○ Efectivo  ● Digital     ║
║  Fecha: [3 feb 2026]             ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │        💾 Guardar            │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 10: Transferencia (Modal Sheet)

```
╔═══════════════════════════════════╗
║  ─── (grab indicator) ───        ║
║                                   ║
║  Transferencia        [Cancelar] ║
║                                   ║
║  Desde                            ║
║  ┌────────┬────────┬──────────┐  ║
║  │▌Vicente▐│ Irene  │ Conjunta │  ║
║  └────────┴────────┴──────────┘  ║
║                                   ║
║           ↓ ↓ ↓                   ║
║                                   ║
║  Hacia                            ║
║  ┌────────┬────────┬──────────┐  ║
║  │ Vicente│ Irene  │▌Conjunta▐│  ║
║  └────────┴────────┴──────────┘  ║
║                                   ║
║  Importe                          ║
║  ┌─────────────────────────────┐  ║
║  │          500,00€             │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Concepto                         ║
║  ┌─────────────────────────────┐  ║
║  │ Aportación mensual           │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  Fecha: [3 feb 2026]             ║
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │     💸 Realizar transferencia│  ║
║  └─────────────────────────────┘  ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Screen 11: 📊 Gráficos (sub-page from Más)

```
╔═══════════════════════════════════╗
║░░░░░░░░░ SAFE AREA TOP ░░░░░░░░░║
╠═══════════════════════════════════╣
║  ◀ Gráficos                      ║
╠═══════════════════════════════════╣
║                                   ║
║  📊 Evolución últimos 6 meses    ║
║  ┌─────────────────────────────┐  ║
║  │                              │  ║
║  │  ██  ██                      │  ║
║  │  ██  ██  ██      ██  ██     │  ║
║  │  ██  ██  ██  ██  ██  ██     │  ║
║  │  ██  ██  ██  ██  ██  ██     │  ║
║  │  ██  ██  ██  ██  ██  ██  ██ │  ║
║  │  Sep Oct Nov Dic Ene Feb     │  ║
║  │                              │  ║
║  │  ■ Ingresos  ■ Gastos       │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  📈 Distribución gastos (Febrero) ║
║  ┌─────────────────────────────┐  ║
║  │ 🏠 Alquiler 65% ████████████│  ║
║  │ 🛒 Super    10% ███         │  ║
║  │ 💡 Suminist  9% ██          │  ║
║  │ 🚗 Transp    5% █           │  ║
║  │ 📱 Internet  5% █           │  ║
║  │ 💊 Salud     4% █           │  ║
║  │ 🍽️ Ocio      2% ▌           │  ║
║  │                              │  ║
║  │ Total: 850,00€              │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  📊 Balance mensual por persona   ║
║  ┌─────────────────────────────┐  ║
║  │ 👨 Vicente                   │  ║
║  │ ██  ██  ██  ▼▼  ██  ██     │  ║
║  │ Ene Feb Mar Abr May Jun     │  ║
║  │ Saldo: 43,82€              │  ║
║  ├─────────────────────────────┤  ║
║  │ 👩 Irene                     │  ║
║  │ ██  ██  ██  ██  ██  ██     │  ║
║  │ Ene Feb Mar Abr May Jun     │  ║
║  │ Saldo: 13.898,10€          │  ║
║  └─────────────────────────────┘  ║
║                                   ║
╠═══════════════════════════════════╣
║  🏠     🛒      📋       💰     ║
╠═══════════════════════════════════╣
║░░░░░ SAFE AREA BOTTOM ░░░░░░░░░░║
╚═══════════════════════════════════╝
```

---

## Component Patterns

### Cards
```
┌─────────────────────────────┐
│ Icon  Title              [→]│   ← Header: 17pt semibold
│                              │
│ Content area                 │   ← Body: 15pt regular
│ Secondary text               │   ← Subhead: 13pt, muted
│                              │
│ [Action Button]              │   ← Optional CTA
└─────────────────────────────┘
  radius: 16pt
  padding: 16pt
  shadow: 0 1px 3px rgba(0,0,0,0.08)
```

### List Item (Financial)
```
┌─────────────────────────────┐
│ 🛒  Mercadona        -87,00€│
│     28 ene · Vicente         │
└─────────────────────────────┘
  height: minimum 60pt
  padding: 12pt horizontal
  swipe-left: edit/delete
```

### Segmented Control
```
┌────────┬────────┬────────┬────┐
│▌Active▐│ Item 2 │ Item 3 │ +  │
└────────┴────────┴────────┴────┘
  height: 32pt
  radius: 8pt
  iOS native segmented control style
```

### Progress Bar
```
  ████████████░░░░░░░  67%
  height: 8pt (thin) or 16pt (prominent)
  radius: 4pt or 8pt
  colors: accent (normal), orange (>80%), red (>100%)
```

### Bottom Sheet
```
  ─── (grab indicator) ───     ← 36×5pt centered
  
  Content starts here          ← padding-top: 16pt
  ...
  
  radius: 12pt top corners
  background: surface color
  drag to dismiss
  3 detents: small (25%), medium (50%), large (90%)
```

---

## Dark Mode Mapping

| Element | Light | Dark |
|---------|-------|------|
| Background | #F2F2F7 | #000000 |
| Surface (cards) | #FFFFFF | #1C1C1E |
| Elevated surface | #FFFFFF | #2C2C2E |
| Text primary | #1C1C1E | #FFFFFF |
| Text secondary | #8E8E93 | #8E8E93 |
| Separator | #C6C6C8 | #38383A |
| Tab bar | #F9F9F9 | #1C1C1E |
| Accent | #7D8B74 | #8FA389 (lighter) |
| Positive | #34C759 | #30D158 |
| Negative | #FF3B30 | #FF453A |

---

## Gesture Map

| Gesture | Context | Action |
|---------|---------|--------|
| Swipe left | Home screen | Open camera |
| Swipe left | List item | Edit/Delete options |
| Swipe right | Sub-page | Navigate back |
| Swipe down | Sheet/Modal | Dismiss |
| Pull down | Any list | Refresh data |
| Long press | Product in list | Edit product |
| Tap | Tab bar icon | Switch tab |
| Double tap | Amount field | Select all for editing |
| Pinch | Chart | Zoom (future) |

---

## Accessibility

- **VoiceOver**: All interactive elements have labels
- **Dynamic Type**: Support up to xxxLarge
- **Reduce Motion**: Disable parallax, use fade transitions
- **Contrast ratio**: Minimum 4.5:1 for text, 3:1 for large text
- **Touch targets**: Minimum 44×44pt
- **Color**: Never use color alone to convey meaning (always + icon/text)
