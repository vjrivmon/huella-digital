# Modelo de Dominio — App de Pus

## Mapa de Entidades

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGGREGATE: CompraInteligente                   │
│                                                                   │
│  ┌──────────────┐    1    ┌───────────────┐    *   ┌──────────┐ │
│  │  ListaCompra  │────────│ ProductoLista  │       │          │ │
│  │              │         │               │       │          │ │
│  │ - presupuesto│         │ - nombre      │       │          │ │
│  │ - estado     │         │ - cantidad    │       │          │ │
│  │ - super      │         │ - checked     │       │          │ │
│  └──────┬───────┘         │ - precio_real │       │          │ │
│         │                 │ - categoria   │       │          │ │
│         │ finalizar()     └───────────────┘       │          │ │
│         ▼                                          │          │ │
│  ┌──────────────┐    *    ┌───────────────┐       │          │ │
│  │    Compra     │────────│  CompraItem    │       │          │ │
│  │  (snapshot)   │        │  (inmutable)   │       │          │ │
│  │ - total       │        │ - precio       │       │          │ │
│  │ - fecha       │        │ - foto_url     │       │          │ │
│  └──────────────┘         └───────────────┘       │          │ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AGGREGATE: MenuSemanal                         │
│                                                                   │
│  ┌──────────────┐    7    ┌───────────────┐   0..2 ┌──────────┐ │
│  │    Menu       │────────│    MenuDia     │────────│  Receta  │ │
│  │              │         │               │        │          │ │
│  │ - semana     │         │ - dia_semana  │        │ - nombre │ │
│  │ - año        │         │ - tipo_comida │        │ - porcio │ │
│  └──────────────┘         └───────────────┘        └────┬─────┘ │
│                                                          │       │
│                                              ┌───────────┴─────┐ │
│                                              │RecetaIngrediente│ │
│                                              │ - producto      │ │
│                                              │ - cantidad      │ │
│                                              │ - unidad        │ │
│                                              └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AGGREGATE: GastosCompartidos                   │
│                                                                   │
│  ┌──────────────┐         ┌───────────────┐                     │
│  │    Gasto      │         │    Ajuste      │                     │
│  │              │         │  (liquidación) │                     │
│  │ - monto      │         │ - monto        │                     │
│  │ - pagado_por │         │ - de → para    │                     │
│  │ - categoria  │         │ - fecha        │                     │
│  │ - concepto   │         └───────────────┘                     │
│  └──────────────┘                                                │
│                                                                   │
│         Balance = Σ(gastos de A)/2 - Σ(gastos de B)/2            │
│                  - Σ(ajustes)                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entidades Principales

### User / Profile

```typescript
interface Profile {
  id: string;           // = auth.users.id
  email: string;
  nombre: string;       // "Vicente" | "Irene"
  avatar_url?: string;
  created_at: Date;
}
```

El `Profile` es una extensión de `auth.users` de Supabase. No es un aggregate propio — es referenciado por todos los demás.

---

### Aggregate: CompraInteligente

**Root: ListaCompra**

```typescript
interface ListaCompra {
  id: string;
  created_by: string;         // profile.id
  nombre: string;             // "Compra semanal", "Mercadona lunes"
  presupuesto: number;        // en céntimos (evitar floats)
  supermercado?: string;      // "Mercadona", "Lidl", etc.
  estado: EstadoLista;        // 'borrador' | 'en_compra' | 'finalizada'
  total_gastado: number;      // calculado: sum(productos checked con precio)
  created_at: Date;
  updated_at: Date;
}

type EstadoLista = 'borrador' | 'en_compra' | 'finalizada';
```

**ProductoLista** — items dentro de una lista activa.

```typescript
interface ProductoLista {
  id: string;
  lista_id: string;
  nombre: string;
  cantidad: number;           // default 1
  unidad?: string;            // "kg", "ud", "L"
  categoria?: CategoriaProducto;
  checked: boolean;           // tachado en el super
  precio_real?: number;       // en céntimos, cuando se escanea/escribe
  foto_precio_url?: string;   // URL en Supabase Storage
  orden: number;              // para drag & drop
  created_at: Date;
}

type CategoriaProducto =
  | 'frutas_verduras'
  | 'carnes'
  | 'pescados'
  | 'lacteos'
  | 'panaderia'
  | 'conservas'
  | 'limpieza'
  | 'higiene'
  | 'bebidas'
  | 'congelados'
  | 'otros';
```

**Compra** — snapshot inmutable cuando se finaliza una lista.

```typescript
interface Compra {
  id: string;
  lista_id: string;           // referencia a la lista original
  user_id: string;            // quién finalizó
  supermercado: string;
  total: number;              // en céntimos
  presupuesto: number;        // lo que se había puesto
  num_productos: number;
  fecha: Date;
  created_at: Date;
}
```

**CompraItem** — cada producto comprado (copia inmutable).

```typescript
interface CompraItem {
  id: string;
  compra_id: string;
  nombre: string;
  cantidad: number;
  unidad?: string;
  precio: number;             // en céntimos
  categoria?: CategoriaProducto;
  foto_precio_url?: string;
}
```

**Invariantes del aggregate:**
- `total_gastado` = Σ precio_real de productos con `checked = true` y precio_real != null
- Al cambiar `estado` a `finalizada`, se crea una `Compra` + `CompraItem[]` como snapshot
- `presupuesto` solo se puede cambiar en estado `borrador` o `en_compra`
- Una lista `finalizada` no se puede editar

---

### Aggregate: MenuSemanal

**Root: Menu**

```typescript
interface Menu {
  id: string;
  semana: number;             // ISO week (1-53)
  anio: number;               // 2025, 2026...
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
```

**MenuDia** — slot de comida en un día.

```typescript
interface MenuDia {
  id: string;
  menu_id: string;
  dia_semana: DiaSemana;      // 0=lunes, 6=domingo
  tipo_comida: TipoComida;    // 'comida' | 'cena'
  receta_id?: string;         // null = sin planificar
  nota?: string;              // "pedir pizza", "sobras"
}

type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TipoComida = 'comida' | 'cena';
```

**Receta** — recetas del repertorio de la pareja.

```typescript
interface Receta {
  id: string;
  nombre: string;
  porciones: number;          // default 2
  tiempo_minutos?: number;
  notas?: string;
  created_by: string;
  created_at: Date;
}
```

**RecetaIngrediente**

```typescript
interface RecetaIngrediente {
  id: string;
  receta_id: string;
  producto_nombre: string;    // texto libre, matchea con ProductoLista
  cantidad: number;
  unidad: string;             // "g", "kg", "ud", "ml", "L"
  categoria?: CategoriaProducto;
}
```

**Invariantes:**
- Un Menu tiene exactamente 14 slots (7 días × 2 comidas), creados al crear el menú
- Al auto-generar lista, se agrupa por `producto_nombre` y se suma `cantidad`
- Estimación de coste usa el último precio conocido de `compra_items` para cada ingrediente

---

### Aggregate: GastosCompartidos

**Root: Gasto**

```typescript
interface Gasto {
  id: string;
  pagado_por: string;         // profile.id
  monto: number;              // en céntimos
  concepto: string;
  categoria: CategoriaGasto;
  fecha: Date;
  compra_id?: string;         // link opcional a una compra del super
  created_at: Date;
}

type CategoriaGasto = 'super' | 'casa' | 'ocio' | 'transporte' | 'salud' | 'otros';
```

**Ajuste** — liquidación de deuda.

```typescript
interface Ajuste {
  id: string;
  de_user_id: string;        // quién paga
  para_user_id: string;      // a quién
  monto: number;             // en céntimos
  nota?: string;
  fecha: Date;
  created_at: Date;
}
```

**Balance** — vista calculada (no tabla).

```typescript
// Balance = lo que cada uno ha pagado ÷ 2 - lo que le tocaba
// Positivo = te deben, Negativo = debes
interface Balance {
  user_id: string;
  total_pagado: number;
  total_compartido: number;   // total_pagado / 2
  ajustes_realizados: number;
  ajustes_recibidos: number;
  balance: number;            // positivo = te deben
}
```

**Invariantes:**
- `balance_vicente + balance_irene = 0` (siempre suman cero)
- Al finalizar una compra del super, se puede auto-crear un Gasto con categoría 'super'
- Un ajuste reduce el balance del deudor

---

## Value Objects

| Value Object | Tipo | Descripción |
|---|---|---|
| `Dinero` | `number` (céntimos) | Siempre en céntimos para evitar errores de punto flotante. 1050 = 10.50€ |
| `EstadoLista` | enum | `borrador` → `en_compra` → `finalizada` (transiciones unidireccionales) |
| `CategoriaProducto` | enum | 11 categorías fijas de supermercado |
| `CategoriaGasto` | enum | 6 categorías de gastos compartidos |
| `DiaSemana` | 0-6 | Lunes=0, Domingo=6 |
| `TipoComida` | enum | `comida` \| `cena` |
| `Semana` | `{semana, anio}` | Identificador único de semana ISO |

---

## Boundaries y Comunicación entre Aggregates

```
CompraInteligente ──finalizar()──→ crea Compra snapshot
         │
         └──auto-gasto──→ GastosCompartidos (opcional)

MenuSemanal ──generar-lista()──→ crea ListaCompra con ProductoLista[]
         │
         └──estimar-coste()──→ lee CompraItem[] del Historial

GastosCompartidos ←── referencia compra_id (opcional)
```

**Reglas de comunicación:**
1. **MenuSemanal → CompraInteligente**: Al generar lista, el menú crea una ListaCompra nueva con productos agregados de las recetas.
2. **CompraInteligente → GastosCompartidos**: Al finalizar compra, opcionalmente se crea un Gasto automático.
3. **Historial → MenuSemanal**: La estimación de costes lee precios históricos (solo lectura).
4. **No hay dependencias circulares**: cada aggregate puede funcionar independiente.
