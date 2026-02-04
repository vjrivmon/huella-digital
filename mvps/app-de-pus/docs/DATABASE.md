# Esquema de Base de Datos — App de Pus (v2 Completo)

> Incluye TODAS las features de AppGastos migradas + features nuevas de App de Pus.

## ENUMs

```sql
-- Lista de compra
CREATE TYPE estado_lista AS ENUM ('borrador', 'en_compra', 'finalizada');

CREATE TYPE categoria_producto AS ENUM (
  'frutas_verduras', 'carnes', 'pescados', 'lacteos',
  'panaderia', 'conservas', 'limpieza', 'higiene',
  'bebidas', 'congelados', 'otros'
);

-- Menú
CREATE TYPE tipo_comida AS ENUM ('comida', 'cena');

-- Gastos compartidos (expandido de AppGastos)
CREATE TYPE categoria_gasto AS ENUM (
  'alquiler', 'suministros', 'internet_movil', 'supermercado',
  'transporte', 'ocio', 'ropa', 'salud', 'suscripciones',
  'ia', 'transferencia', 'otros'
);

-- Ingresos (de AppGastos)
CREATE TYPE categoria_ingreso AS ENUM (
  'nomina', 'pagas_extra', 'freelance', 'becas',
  'efectivo_negro', 'transferencia', 'otros'
);

-- Tipo de dinero (de AppGastos)
CREATE TYPE tipo_dinero AS ENUM ('efectivo', 'digital');

-- Clasificación de gasto (de AppGastos)
CREATE TYPE clasificacion_gasto AS ENUM ('individual', 'conjunta', 'transferencia');

-- Quién (persona o cuenta)
CREATE TYPE miembro AS ENUM ('m1', 'm2', 'conjunta');

-- Estado de beca
CREATE TYPE estado_beca AS ENUM ('pendiente', 'mensual', 'cobrada');

-- Tipo de ingreso
CREATE TYPE tipo_ingreso_enum AS ENUM ('fijo', 'variable');

-- Frecuencia para pagos recurrentes
CREATE TYPE frecuencia_pago AS ENUM ('mensual', 'trimestral', 'semestral', 'anual');
```

---

## Tablas

### profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  avatar_url TEXT,
  hogar_id UUID REFERENCES hogares(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### hogares

```sql
CREATE TABLE hogares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL DEFAULT 'Mi Hogar',
  nombre_m1 TEXT NOT NULL DEFAULT 'Miembro 1',
  nombre_m2 TEXT NOT NULL DEFAULT 'Miembro 2',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### hogar_miembros

```sql
CREATE TABLE hogar_miembros (
  hogar_id UUID NOT NULL REFERENCES hogares(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rol miembro NOT NULL DEFAULT 'm1',  -- m1 = creador, m2 = invitado
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (hogar_id, user_id)
);

CREATE INDEX idx_hogar_miembros_user ON hogar_miembros(user_id);
```

### invitaciones

```sql
CREATE TABLE invitaciones (
  codigo TEXT PRIMARY KEY,               -- 6 chars uppercase
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  creado_por UUID NOT NULL REFERENCES profiles(id),
  usado_por UUID REFERENCES profiles(id),
  usado BOOLEAN NOT NULL DEFAULT false,
  expira_en TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitaciones_hogar ON invitaciones(hogar_id);
```

---

### config_hogar (saldos iniciales, presupuesto, calculadora piso)

```sql
CREATE TABLE config_hogar (
  hogar_id UUID PRIMARY KEY REFERENCES hogares(id) ON DELETE CASCADE,
  
  -- Saldos iniciales
  saldos_fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  saldo_m1_fisico INTEGER NOT NULL DEFAULT 0,       -- céntimos
  saldo_m1_digital INTEGER NOT NULL DEFAULT 0,
  saldo_m2_fisico INTEGER NOT NULL DEFAULT 0,
  saldo_m2_digital INTEGER NOT NULL DEFAULT 0,
  saldo_conjunta_fisico INTEGER NOT NULL DEFAULT 0,
  saldo_conjunta_digital INTEGER NOT NULL DEFAULT 0,
  
  -- Presupuesto mensual
  presupuesto_mensual INTEGER NOT NULL DEFAULT 0,    -- céntimos
  alerta_80 BOOLEAN NOT NULL DEFAULT true,
  alerta_100 BOOLEAN NOT NULL DEFAULT true,
  
  -- Penalizaciones tareas
  tipo_penalizacion TEXT NOT NULL DEFAULT 'dinero',
  cantidad_penalizacion INTEGER NOT NULL DEFAULT 500, -- céntimos
  
  -- Sueldos base (legacy, para cálculos)
  sueldo_m1 INTEGER NOT NULL DEFAULT 0,              -- céntimos
  sueldo_m2 INTEGER NOT NULL DEFAULT 0,
  porcentaje_aportacion INTEGER NOT NULL DEFAULT 50,
  
  -- Calculadora piso
  piso_precio INTEGER NOT NULL DEFAULT 29900000,      -- céntimos (299.000€)
  piso_tipo TEXT NOT NULL DEFAULT 'nueva',             -- 'nueva' | 'segunda_mano'
  piso_menor_35 BOOLEAN NOT NULL DEFAULT true,
  piso_financiacion INTEGER NOT NULL DEFAULT 80,       -- porcentaje
  piso_tin_anual NUMERIC(5,2) NOT NULL DEFAULT 3.0,
  piso_plazo_anios INTEGER NOT NULL DEFAULT 30,
  piso_ingresos_netos_mes INTEGER NOT NULL DEFAULT 300000, -- céntimos
  piso_muebles INTEGER NOT NULL DEFAULT 0,
  piso_colchon_emergencia INTEGER NOT NULL DEFAULT 300000,
  
  -- UI preferences
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  accent_color TEXT NOT NULL DEFAULT '#7D8B74',
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### listas_compra

```sql
CREATE TABLE listas_compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  nombre TEXT NOT NULL DEFAULT '',
  presupuesto INTEGER NOT NULL DEFAULT 0,        -- céntimos
  supermercado TEXT,
  estado estado_lista NOT NULL DEFAULT 'borrador',
  total_gastado INTEGER NOT NULL DEFAULT 0,       -- céntimos, calculado
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listas_hogar ON listas_compra(hogar_id);
CREATE INDEX idx_listas_estado ON listas_compra(hogar_id, estado);
CREATE INDEX idx_listas_created_at ON listas_compra(created_at DESC);
```

### productos_lista

```sql
CREATE TABLE productos_lista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lista_id UUID NOT NULL REFERENCES listas_compra(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cantidad NUMERIC(10,2) NOT NULL DEFAULT 1,
  unidad TEXT,                                    -- "kg", "ud", "L"
  categoria categoria_producto DEFAULT 'otros',
  checked BOOLEAN NOT NULL DEFAULT false,
  precio_real INTEGER,                            -- céntimos
  foto_precio_url TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_productos_lista_id ON productos_lista(lista_id);
CREATE INDEX idx_productos_orden ON productos_lista(lista_id, orden);
```

### compras (snapshots finalizados)

```sql
CREATE TABLE compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  lista_id UUID REFERENCES listas_compra(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  supermercado TEXT NOT NULL,
  total INTEGER NOT NULL,                         -- céntimos
  presupuesto INTEGER NOT NULL,
  num_productos INTEGER NOT NULL DEFAULT 0,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_compras_hogar ON compras(hogar_id);
CREATE INDEX idx_compras_fecha ON compras(hogar_id, fecha DESC);
CREATE INDEX idx_compras_super ON compras(supermercado);
```

### compra_items

```sql
CREATE TABLE compra_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cantidad NUMERIC(10,2) NOT NULL DEFAULT 1,
  unidad TEXT,
  precio INTEGER NOT NULL,                        -- céntimos
  categoria categoria_producto DEFAULT 'otros',
  foto_precio_url TEXT
);

CREATE INDEX idx_compra_items_compra ON compra_items(compra_id);
CREATE INDEX idx_compra_items_nombre ON compra_items(nombre);
CREATE INDEX idx_compra_items_trend ON compra_items(nombre, compra_id);
```

### productos_frecuentes

```sql
CREATE TABLE productos_frecuentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  categoria categoria_producto DEFAULT 'otros',
  uso_count INTEGER NOT NULL DEFAULT 1,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hogar_id, nombre)
);

CREATE INDEX idx_prod_frec_hogar ON productos_frecuentes(hogar_id, uso_count DESC);
```

---

### recetas

```sql
CREATE TABLE recetas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  porciones INTEGER NOT NULL DEFAULT 2,
  tiempo_minutos INTEGER,
  notas TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recetas_hogar ON recetas(hogar_id);
CREATE INDEX idx_recetas_nombre ON recetas(hogar_id, nombre);
```

### receta_ingredientes

```sql
CREATE TABLE receta_ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receta_id UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  producto_nombre TEXT NOT NULL,
  cantidad NUMERIC(10,2) NOT NULL,
  unidad TEXT NOT NULL,
  categoria categoria_producto DEFAULT 'otros'
);

CREATE INDEX idx_receta_ing_receta ON receta_ingredientes(receta_id);
```

### menus_semanales

```sql
CREATE TABLE menus_semanales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  semana INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hogar_id, semana, anio)
);
```

### menu_dias

```sql
CREATE TABLE menu_dias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus_semanales(id) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  tipo_comida tipo_comida NOT NULL,
  receta_id UUID REFERENCES recetas(id) ON DELETE SET NULL,
  nota TEXT,
  UNIQUE(menu_id, dia_semana, tipo_comida)
);

CREATE INDEX idx_menu_dias_menu ON menu_dias(menu_id);
CREATE INDEX idx_menu_dias_receta ON menu_dias(receta_id);
```

---

### ingresos (NUEVA — de AppGastos)

```sql
CREATE TABLE ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  quien miembro NOT NULL,                          -- m1, m2, conjunta
  importe INTEGER NOT NULL,                        -- céntimos
  concepto TEXT NOT NULL,
  categoria categoria_ingreso NOT NULL DEFAULT 'otros',
  tipo tipo_dinero NOT NULL DEFAULT 'digital',     -- efectivo / digital
  tipo_ingreso tipo_ingreso_enum NOT NULL DEFAULT 'variable', -- fijo / variable
  proyectado BOOLEAN NOT NULL DEFAULT false,
  es_tercero BOOLEAN NOT NULL DEFAULT false,        -- ingreso de tercero a conjunta
  transferencia_id TEXT,                            -- link con gasto si es transferencia
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingresos_hogar ON ingresos(hogar_id);
CREATE INDEX idx_ingresos_fecha ON ingresos(hogar_id, fecha DESC);
CREATE INDEX idx_ingresos_quien ON ingresos(hogar_id, quien);
CREATE INDEX idx_ingresos_categoria ON ingresos(hogar_id, categoria);
CREATE INDEX idx_ingresos_transf ON ingresos(transferencia_id) WHERE transferencia_id IS NOT NULL;
```

### gastos (EXPANDIDA — de AppGastos)

```sql
CREATE TABLE gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  quien miembro NOT NULL,                          -- m1, m2, conjunta
  importe INTEGER NOT NULL,                        -- céntimos
  concepto TEXT NOT NULL,
  categoria categoria_gasto NOT NULL DEFAULT 'otros',
  tipo tipo_dinero NOT NULL DEFAULT 'digital',
  clasificacion clasificacion_gasto NOT NULL DEFAULT 'individual',
  proyectado BOOLEAN NOT NULL DEFAULT false,
  transferencia_id TEXT,                            -- link con ingreso si es transferencia
  compra_id UUID REFERENCES compras(id) ON DELETE SET NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gastos_hogar ON gastos(hogar_id);
CREATE INDEX idx_gastos_fecha ON gastos(hogar_id, fecha DESC);
CREATE INDEX idx_gastos_quien ON gastos(hogar_id, quien);
CREATE INDEX idx_gastos_categoria ON gastos(hogar_id, categoria);
CREATE INDEX idx_gastos_transf ON gastos(transferencia_id) WHERE transferencia_id IS NOT NULL;
```

### ajustes (liquidaciones de deuda entre pareja)

```sql
CREATE TABLE ajustes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  de_user_id UUID NOT NULL REFERENCES profiles(id),
  para_user_id UUID NOT NULL REFERENCES profiles(id),
  monto INTEGER NOT NULL,                         -- céntimos
  nota TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (de_user_id != para_user_id)
);

CREATE INDEX idx_ajustes_hogar ON ajustes(hogar_id);
CREATE INDEX idx_ajustes_fecha ON ajustes(hogar_id, fecha DESC);
```

---

### becas (NUEVA — de AppGastos)

```sql
CREATE TABLE becas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  quien miembro NOT NULL,
  importe INTEGER NOT NULL,                        -- céntimos
  pagos INTEGER NOT NULL DEFAULT 1,
  estado estado_beca NOT NULL DEFAULT 'pendiente',
  fecha_cobro DATE,                                -- solo para cobradas
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_becas_hogar ON becas(hogar_id);
CREATE INDEX idx_becas_estado ON becas(hogar_id, estado);
```

---

### aportaciones_conjunta (NUEVA — de AppGastos)

```sql
CREATE TABLE aportaciones_conjunta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  mes TEXT NOT NULL,                               -- "2026-01", "2026-02"
  aportacion_m1 INTEGER NOT NULL DEFAULT 0,        -- céntimos
  aportacion_m2 INTEGER NOT NULL DEFAULT 0,
  otros INTEGER NOT NULL DEFAULT 0,                -- intereses, terceros
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hogar_id, mes)
);

CREATE INDEX idx_aport_conj_hogar ON aportaciones_conjunta(hogar_id);
```

### saldos_mensuales (NUEVA — cierre de mes de AppGastos)

```sql
CREATE TABLE saldos_mensuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  mes TEXT NOT NULL,                               -- "2026-01"
  saldo_m1 INTEGER NOT NULL DEFAULT 0,             -- céntimos
  saldo_m2 INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hogar_id, mes)
);

CREATE INDEX idx_saldos_hogar ON saldos_mensuales(hogar_id);
```

---

### metas (NUEVA — de AppGastos)

```sql
CREATE TABLE metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  objetivo INTEGER NOT NULL,                       -- céntimos
  actual INTEGER NOT NULL DEFAULT 0,               -- céntimos
  fecha_limite DATE,
  color TEXT NOT NULL DEFAULT '#7D8B74',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_metas_hogar ON metas(hogar_id);
```

### pagos_recurrentes (NUEVA — de AppGastos)

```sql
CREATE TABLE pagos_recurrentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  concepto TEXT NOT NULL,
  importe INTEGER NOT NULL,                        -- céntimos
  dia_mes INTEGER NOT NULL DEFAULT 1 CHECK (dia_mes BETWEEN 1 AND 31),
  categoria categoria_gasto NOT NULL DEFAULT 'otros',
  frecuencia frecuencia_pago NOT NULL DEFAULT 'mensual',
  quien miembro NOT NULL DEFAULT 'conjunta',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pagos_rec_hogar ON pagos_recurrentes(hogar_id);
CREATE INDEX idx_pagos_rec_activo ON pagos_recurrentes(hogar_id, activo) WHERE activo = true;
```

---

### tareas_hogar (NUEVA — de AppGastos)

```sql
CREATE TABLE tareas_hogar (
  id TEXT NOT NULL,                                 -- 'salon', 'cocina', etc.
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  icono TEXT NOT NULL,
  frecuencia_dias INTEGER NOT NULL,
  ultima_vez TIMESTAMPTZ,
  PRIMARY KEY (hogar_id, id)
);
```

### historial_limpieza (NUEVA — de AppGastos)

```sql
CREATE TABLE historial_limpieza (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  tarea_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  icono TEXT NOT NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hist_limp_hogar ON historial_limpieza(hogar_id, fecha DESC);
```

---

### lista_compra_rapida (NUEVA — lista simple de AppGastos, separada de compra inteligente)

```sql
CREATE TABLE lista_compra_rapida (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hogar_id UUID NOT NULL REFERENCES hogares(id),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'general',
  comprado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lista_rapida_hogar ON lista_compra_rapida(hogar_id);
```

---

## Vistas

### balance_compartido (gastos 50/50)

```sql
CREATE OR REPLACE VIEW balance_compartido AS
WITH gastos_por_persona AS (
  SELECT
    hogar_id,
    quien,
    SUM(importe) AS total_pagado
  FROM gastos
  WHERE quien IN ('m1', 'm2')
    AND clasificacion != 'transferencia'
  GROUP BY hogar_id, quien
),
ajustes_enviados AS (
  SELECT
    hogar_id,
    de_user_id,
    SUM(monto) AS total_enviado
  FROM ajustes
  GROUP BY hogar_id, de_user_id
),
ajustes_recibidos AS (
  SELECT
    hogar_id,
    para_user_id,
    SUM(monto) AS total_recibido
  FROM ajustes
  GROUP BY hogar_id, para_user_id
),
totales AS (
  SELECT
    hogar_id,
    SUM(importe) AS total
  FROM gastos
  WHERE quien IN ('m1', 'm2')
    AND clasificacion != 'transferencia'
  GROUP BY hogar_id
)
SELECT
  h.id AS hogar_id,
  h.nombre_m1,
  h.nombre_m2,
  COALESCE(g1.total_pagado, 0) AS m1_pagado,
  COALESCE(g2.total_pagado, 0) AS m2_pagado,
  COALESCE(t.total, 0) / 2 AS parte_justa,
  COALESCE(g1.total_pagado, 0) - COALESCE(t.total, 0) / 2 AS m1_balance,
  COALESCE(g2.total_pagado, 0) - COALESCE(t.total, 0) / 2 AS m2_balance
FROM hogares h
LEFT JOIN gastos_por_persona g1 ON g1.hogar_id = h.id AND g1.quien = 'm1'
LEFT JOIN gastos_por_persona g2 ON g2.hogar_id = h.id AND g2.quien = 'm2'
LEFT JOIN totales t ON t.hogar_id = h.id;
```

### patrimonio_actual

```sql
CREATE OR REPLACE VIEW patrimonio_actual AS
SELECT
  c.hogar_id,
  -- Vicente
  c.saldo_m1_fisico + COALESCE(ing_m1_f.total, 0) - COALESCE(gas_m1_f.total, 0) AS m1_fisico,
  c.saldo_m1_digital + COALESCE(ing_m1_d.total, 0) - COALESCE(gas_m1_d.total, 0) AS m1_digital,
  -- Irene
  c.saldo_m2_fisico + COALESCE(ing_m2_f.total, 0) - COALESCE(gas_m2_f.total, 0) AS m2_fisico,
  c.saldo_m2_digital + COALESCE(ing_m2_d.total, 0) - COALESCE(gas_m2_d.total, 0) AS m2_digital,
  -- Conjunta
  c.saldo_conjunta_fisico AS conjunta_fisico,
  c.saldo_conjunta_digital 
    + COALESCE(aport.total_aport, 0) 
    + COALESCE(ing_conj.total, 0) 
    - COALESCE(gas_conj.total, 0) AS conjunta_digital
FROM config_hogar c
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM ingresos 
  WHERE hogar_id = c.hogar_id AND quien = 'm1' AND tipo = 'efectivo' AND fecha >= c.saldos_fecha
) ing_m1_f ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM ingresos 
  WHERE hogar_id = c.hogar_id AND quien = 'm1' AND tipo = 'digital' AND fecha >= c.saldos_fecha
) ing_m1_d ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM gastos 
  WHERE hogar_id = c.hogar_id AND quien = 'm1' AND tipo = 'efectivo' AND fecha >= c.saldos_fecha
) gas_m1_f ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM gastos 
  WHERE hogar_id = c.hogar_id AND quien = 'm1' AND tipo = 'digital' AND fecha >= c.saldos_fecha
) gas_m1_d ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM ingresos 
  WHERE hogar_id = c.hogar_id AND quien = 'm2' AND tipo = 'efectivo' AND fecha >= c.saldos_fecha
) ing_m2_f ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM ingresos 
  WHERE hogar_id = c.hogar_id AND quien = 'm2' AND tipo = 'digital' AND fecha >= c.saldos_fecha
) ing_m2_d ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM gastos 
  WHERE hogar_id = c.hogar_id AND quien = 'm2' AND tipo = 'efectivo' AND fecha >= c.saldos_fecha
) gas_m2_f ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM gastos 
  WHERE hogar_id = c.hogar_id AND quien = 'm2' AND tipo = 'digital' AND fecha >= c.saldos_fecha
) gas_m2_d ON true
LEFT JOIN LATERAL (
  SELECT SUM(aportacion_m1 + aportacion_m2 + otros) AS total_aport 
  FROM aportaciones_conjunta WHERE hogar_id = c.hogar_id
) aport ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM ingresos 
  WHERE hogar_id = c.hogar_id AND quien = 'conjunta' AND fecha >= c.saldos_fecha
) ing_conj ON true
LEFT JOIN LATERAL (
  SELECT SUM(importe) AS total FROM gastos 
  WHERE hogar_id = c.hogar_id AND quien = 'conjunta' AND fecha >= c.saldos_fecha
) gas_conj ON true;
```

---

## Triggers

### Actualizar total_gastado en lista

```sql
CREATE OR REPLACE FUNCTION update_lista_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE listas_compra
  SET
    total_gastado = (
      SELECT COALESCE(SUM(precio_real), 0)
      FROM productos_lista
      WHERE lista_id = COALESCE(NEW.lista_id, OLD.lista_id)
        AND checked = true
        AND precio_real IS NOT NULL
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.lista_id, OLD.lista_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_lista_total
  AFTER INSERT OR UPDATE OR DELETE ON productos_lista
  FOR EACH ROW EXECUTE FUNCTION update_lista_total();
```

### Auto-crear config_hogar al crear hogar

```sql
CREATE OR REPLACE FUNCTION create_hogar_config()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO config_hogar (hogar_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_hogar_config
  AFTER INSERT ON hogares
  FOR EACH ROW EXECUTE FUNCTION create_hogar_config();
```

### Auto-inicializar tareas del hogar

```sql
CREATE OR REPLACE FUNCTION init_tareas_hogar()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tareas_hogar (id, hogar_id, nombre, icono, frecuencia_dias) VALUES
    ('salon', NEW.id, 'Salón', '🛋️', 7),
    ('cocina', NEW.id, 'Cocina', '🍳', 3),
    ('bano', NEW.id, 'Baño', '🚿', 5),
    ('dormitorio', NEW.id, 'Dormitorio', '🛏️', 7),
    ('basura', NEW.id, 'Basura', '🗑️', 2),
    ('lavadora', NEW.id, 'Lavadora', '🫧', 3),
    ('tender', NEW.id, 'Tender', '👕', 3),
    ('planchar', NEW.id, 'Planchar', '🧺', 7),
    ('suelos', NEW.id, 'Suelos', '🧹', 5),
    ('polvo', NEW.id, 'Polvo', '✨', 7),
    ('cristales', NEW.id, 'Cristales', '🪟', 14),
    ('nevera', NEW.id, 'Nevera', '🧊', 14);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_init_tareas
  AFTER INSERT ON hogares
  FOR EACH ROW EXECUTE FUNCTION init_tareas_hogar();
```

---

## RLS Policies

```sql
-- Activar RLS en TODAS las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hogares ENABLE ROW LEVEL SECURITY;
ALTER TABLE hogar_miembros ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_hogar ENABLE ROW LEVEL SECURITY;
ALTER TABLE listas_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos_lista ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE compra_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos_frecuentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE receta_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus_semanales ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_dias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ajustes ENABLE ROW LEVEL SECURITY;
ALTER TABLE becas ENABLE ROW LEVEL SECURITY;
ALTER TABLE aportaciones_conjunta ENABLE ROW LEVEL SECURITY;
ALTER TABLE saldos_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos_recurrentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas_hogar ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_limpieza ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_compra_rapida ENABLE ROW LEVEL SECURITY;

-- Helper: check user is member of a hogar
CREATE OR REPLACE FUNCTION user_hogar_id()
RETURNS UUID AS $$
  SELECT hogar_id FROM hogar_miembros WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- All hogar-scoped tables use the same pattern:
-- SELECT/INSERT/UPDATE/DELETE WHERE hogar_id = user_hogar_id()

-- Example for gastos (apply same pattern to all hogar-scoped tables):
CREATE POLICY "Hogar members full access"
  ON gastos FOR ALL
  USING (hogar_id = user_hogar_id())
  WITH CHECK (hogar_id = user_hogar_id());

-- Repeat for: ingresos, listas_compra, productos_lista (via lista join),
-- compras, compra_items (via compra join), recetas, receta_ingredientes,
-- menus_semanales, menu_dias, ajustes, becas, aportaciones_conjunta,
-- saldos_mensuales, metas, pagos_recurrentes, tareas_hogar,
-- historial_limpieza, lista_compra_rapida, config_hogar, productos_frecuentes
```

---

## Supabase Storage

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('ocr-photos', 'ocr-photos', false);

CREATE POLICY "Hogar members can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ocr-photos'
    AND EXISTS (SELECT 1 FROM hogar_miembros WHERE user_id = auth.uid())
  );

CREATE POLICY "Hogar members can read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ocr-photos'
    AND EXISTS (SELECT 1 FROM hogar_miembros WHERE user_id = auth.uid())
  );
```

---

## Supabase Realtime

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE listas_compra;
ALTER PUBLICATION supabase_realtime ADD TABLE productos_lista;
ALTER PUBLICATION supabase_realtime ADD TABLE menus_semanales;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_dias;
ALTER PUBLICATION supabase_realtime ADD TABLE ingresos;
ALTER PUBLICATION supabase_realtime ADD TABLE gastos;
ALTER PUBLICATION supabase_realtime ADD TABLE ajustes;
ALTER PUBLICATION supabase_realtime ADD TABLE becas;
ALTER PUBLICATION supabase_realtime ADD TABLE metas;
ALTER PUBLICATION supabase_realtime ADD TABLE tareas_hogar;
ALTER PUBLICATION supabase_realtime ADD TABLE historial_limpieza;
ALTER PUBLICATION supabase_realtime ADD TABLE lista_compra_rapida;
ALTER PUBLICATION supabase_realtime ADD TABLE aportaciones_conjunta;
ALTER PUBLICATION supabase_realtime ADD TABLE config_hogar;
```

---

## Tabla Resumen

| Tabla | Origen | Descripción |
|-------|--------|-------------|
| profiles | Original | Usuarios |
| hogares | AppGastos | Hogar compartido |
| hogar_miembros | AppGastos | Miembros del hogar |
| invitaciones | AppGastos | Códigos invitación |
| config_hogar | AppGastos | Toda la configuración |
| listas_compra | Original | Listas de compra inteligente |
| productos_lista | Original | Items en lista activa |
| compras | Original | Snapshots de compras |
| compra_items | Original | Items comprados |
| productos_frecuentes | AppGastos | Productos frecuentes |
| recetas | Original | Recetas |
| receta_ingredientes | Original | Ingredientes de recetas |
| menus_semanales | Original | Menús semanales |
| menu_dias | Original | Slots de menú |
| **ingresos** | **AppGastos** | **Ingresos por persona** |
| gastos | Expandida | Gastos con categorías AppGastos |
| ajustes | Original | Liquidaciones de deuda |
| **becas** | **AppGastos** | **Becas y ayudas** |
| **aportaciones_conjunta** | **AppGastos** | **Aportaciones mensuales** |
| **saldos_mensuales** | **AppGastos** | **Cierre de mes** |
| **metas** | **AppGastos** | **Metas de ahorro** |
| **pagos_recurrentes** | **AppGastos** | **Pagos recurrentes** |
| **tareas_hogar** | **AppGastos** | **Tareas limpieza** |
| **historial_limpieza** | **AppGastos** | **Log de limpieza** |
| **lista_compra_rapida** | **AppGastos** | **Lista simple** |

**Total: 25 tablas** (12 originales + 13 de AppGastos)
