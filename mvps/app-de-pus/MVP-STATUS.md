# MVP: App de Pus
## Estado: Fase 2 — Diseño (en progreso)
## Fases completadas: [x] Entrevista [~] Diseño [ ] Arquitectura [ ] Implementación [ ] Polish [ ] Delivery
## Última actualización: 2026-02-02
## Stack: Next.js + Supabase + TailwindCSS (por confirmar)
## Usuarios: Vicente + Irene (pareja)

## Features confirmadas (audio 2026-02-02):
### 1. Compra en supermercado (prioridad alta)
- Lista de la compra integrada
- Doble input: foto del precio (IA extrae precio) + input manual
- Presupuesto máximo (ej: 100€) con tracking en tiempo real
- Ver cuánto llevas gastado y cuánto te queda
- Checklist: ir tachando productos de la lista a medida que compras
- Todo en UNA pantalla (no cambiar entre apps/calculadora/notas)

### 2. Historial de compras
- Registrar cada compra: fecha, supermercado, total, productos
- Ver cuánto gastas por día/semana/mes
- Tracking de precios por supermercado (ver si suben/bajan)
- Ej: "2 feb Famílica → 99,96€"

### 3. Menú semanal (de Nutricoach)
- Planificar menú de la semana ANTES del super
- Auto-generar lista de la compra desde el menú
- Estimar coste basado en historial de precios
- Comprobar que llevas todo lo del menú en el carrito
- Compartido entre Vicente e Irene

### 4. Gastos compartidos (de AppGastos)
- Llevar cuenta de gastos de pareja
- (detalles por definir — menor prioridad en MVP)

## Decisiones técnicas:
- Offline NO necesario (siempre tiene cobertura)
- Online-first OK
- IA para OCR precios: Claude Haiku o modelo ligero (PENDIENTE: resolver si Max token sirve para API)
- Stack: "su favorito" → Next.js + Supabase

## Notas:
- La compra del super es el pain point principal que motivó el MVP
- Unifica AppGastos (Firebase vanilla JS) + Nutricoach (Next.js + Supabase)
- Migrar todo a Supabase
- Nutrición compartida
- Mobile First
