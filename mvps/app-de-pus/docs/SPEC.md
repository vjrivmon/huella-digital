# SPEC: App de Pus

## Visión
App unificada para Vicente e Irene que combina: compra inteligente en el supermercado (lista + tracking de presupuesto + OCR de precios), menú semanal con generación automática de lista de compra, historial de gastos, y gastos compartidos de pareja.

## Usuarios
- **Vicente** — usuario principal
- **Irene** — pareja, comparte menú y gastos
- Solo 2 usuarios. Auth ultra-simple.

## Problema que resuelve
Al hacer la compra semanal, Vicente tiene que alternar entre calculadora (para sumar precios), notas (para la lista) y la app de recetas (para saber qué comprar). Quiere todo en UNA pantalla: ver la lista, ir marcando productos, sumar precios automáticamente y no pasarse de presupuesto.

## Features MVP

### F1: Compra Inteligente (core)
- **Lista de la compra** — crear/editar lista de productos a comprar
- **Presupuesto** — definir límite (ej: 100€) antes de empezar
- **Añadir producto al carrito** — dos modos:
  - 📸 **Foto del precio** → Gemini Flash extrae precio automáticamente
  - ✏️ **Input manual** → teclado numérico rápido
- **Tracking en tiempo real** — barra de progreso: gastado vs presupuesto, cuánto queda
- **Checklist** — tachar productos de la lista al añadirlos al carrito
- **Una pantalla** — lista + carrito + presupuesto todo visible

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

### F4: Gastos Compartidos
- Registrar gastos de pareja (quién pagó, cuánto, concepto)
- Balance: quién debe a quién
- Categorías básicas (super, casa, ocio, transporte)
- Historial de pagos/ajustes

## Stack Técnico
- **Frontend**: Next.js 15 + React 19 + TailwindCSS
- **Backend/DB**: Supabase (Auth + PostgreSQL + Storage + Realtime)
- **IA/OCR**: Google Gemini 2.0 Flash (gratis, API key)
- **Hosting**: Vercel (free tier)
- **Mobile**: PWA (Mobile First, installable)

## Auth
- Supabase Auth con **Magic Link** (email)
- Sin contraseñas — recibes email, click, estás dentro
- Solo 2 emails autorizados (Vicente + Irene)
- Whitelist en Supabase RLS

## No entra en MVP
- Offline mode (siempre hay cobertura)
- Escaneo de código de barras
- Integración con APIs de supermercados
- Recetas con IA generativa (se añaden manualmente)
- Notificaciones push
- Multi-idioma

## Requisitos no funcionales
- Mobile First (80% del uso será en el super con móvil)
- Carga rápida (<2s)
- Cámara nativa del navegador (no app nativa)
- Datos compartidos en tiempo real (Supabase Realtime)
- RGPD: datos personales solo de 2 usuarios conocidos

## Deadline
- No hay fecha límite fija
- Prioridad: F1 (compra) > F3 (menú) > F2 (historial) > F4 (gastos)
