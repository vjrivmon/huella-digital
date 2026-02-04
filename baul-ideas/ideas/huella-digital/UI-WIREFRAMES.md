# UI Wireframes - Huella Digital

> Wireframes ASCII y especificaciones de interfaz de usuario.

**Version:** 1.0  
**Fecha:** 2026-02-04  
**Design System:** shadcn/ui + Tailwind CSS

---

## 1. Principios de Diseno

### 1.1 Mobile-First

- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch targets minimo 44x44px
- Navegacion inferior en mobile

### 1.2 Accesibilidad (WCAG AA)

- Contraste minimo 4.5:1 para texto
- Focus visible en todos los elementos interactivos
- Labels en todos los inputs
- Roles ARIA donde corresponda

### 1.3 Dark Mode

- Colores semanticos via CSS variables
- Respeta preferencia del sistema
- Toggle manual disponible

### 1.4 Internacionalizacion

- Textos via archivos de traduccion
- RTL-ready (preparado pero no implementado en MVP)
- Fechas y numeros localizados

---

## 2. Landing Page

### 2.1 Desktop (1280px+)

```
+------------------------------------------------------------------------+
|  [Logo] Huella Digital          [Funciones] [Precios] [ES|EN] [Acceder]|
+------------------------------------------------------------------------+
|                                                                        |
|                                                                        |
|         Descubre y controla                                            |
|         tu presencia en internet                                       |
|         ________________________________                               |
|                                                                        |
|         Encuentra donde aparece tu informacion online y                |
|         ejerce tu derecho al olvido con un clic.                       |
|                                                                        |
|         [    Empezar gratis    ]    [Ver demo]                         |
|                                                                        |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|    +------------------+  +------------------+  +------------------+    |
|    |                  |  |                  |  |                  |    |
|    |    [icono]       |  |    [icono]       |  |    [icono]       |    |
|    |                  |  |                  |  |                  |    |
|    |   Busca tu       |  |   Identifica     |  |   Solicita       |    |
|    |   huella         |  |   riesgos        |  |   eliminacion    |    |
|    |                  |  |                  |  |                  |    |
|    |   Escaneamos     |  |   Clasificamos   |  |   Generamos      |    |
|    |   multiples      |  |   por severidad  |  |   solicitudes    |    |
|    |   fuentes        |  |   y tipo         |  |   GDPR legales   |    |
|    |                  |  |                  |  |                  |    |
|    +------------------+  +------------------+  +------------------+    |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|    Como funciona                                                       |
|    ____________                                                        |
|                                                                        |
|    1. Introduce tu nombre, email y usernames                           |
|       [========================================]                       |
|                                                                        |
|    2. Recibe un informe detallado                                      |
|       [========================================]                       |
|                                                                        |
|    3. Genera solicitudes de eliminacion                                |
|       [========================================]                       |
|                                                                        |
|    4. Haz seguimiento hasta su resolucion                              |
|       [========================================]                       |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|    Precios                                                             |
|    _______                                                             |
|                                                                        |
|    +------------------+  +------------------+  +------------------+    |
|    |     GRATIS       |  |      PRO         |  |   ENTERPRISE     |    |
|    |                  |  |                  |  |                  |    |
|    |     0 EUR/mes    |  |    9 EUR/mes     |  |    Contactar     |    |
|    |                  |  |                  |  |                  |    |
|    | * 3 busquedas/dia|  | * 30 busq/dia    |  | * Ilimitado      |    |
|    | * Templates GDPR |  | * Todo Free +    |  | * Todo Pro +     |    |
|    | * 30 dias datos  |  | * Monitoreo      |  | * API access     |    |
|    |                  |  | * Prioridad      |  | * SLA            |    |
|    |                  |  |                  |  | * Soporte        |    |
|    |                  |  |                  |  |                  |    |
|    | [Empezar gratis] |  | [Elegir Pro]     |  | [Contactar]      |    |
|    +------------------+  +------------------+  +------------------+    |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|    [Logo]                                                              |
|                                                                        |
|    Producto        Legal              Contacto                         |
|    - Funciones     - Privacidad       - soporte@huelladigital.app      |
|    - Precios       - Terminos         - Twitter                        |
|    - FAQ           - Cookies          - LinkedIn                       |
|                                                                        |
|    (c) 2026 Huella Digital. Todos los derechos reservados.             |
|                                                                        |
+------------------------------------------------------------------------+
```

### 2.2 Mobile (375px)

```
+----------------------------------+
|  [=] Huella Digital     [Acceder]|
+----------------------------------+
|                                  |
|  Descubre y controla             |
|  tu presencia en internet        |
|  ____________________________    |
|                                  |
|  Encuentra donde aparece tu      |
|  informacion online y ejerce tu  |
|  derecho al olvido con un clic.  |
|                                  |
|  [      Empezar gratis      ]    |
|                                  |
|  [        Ver demo          ]    |
|                                  |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  |        [icono]             |  |
|  |     Busca tu huella        |  |
|  |   Escaneamos multiples     |  |
|  |   fuentes por ti           |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  |        [icono]             |  |
|  |    Identifica riesgos      |  |
|  |   Clasificamos por         |  |
|  |   severidad y tipo         |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  |        [icono]             |  |
|  |   Solicita eliminacion     |  |
|  |   Generamos solicitudes    |  |
|  |   GDPR legales             |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

---

## 3. Dashboard

### 3.1 Desktop

```
+------------------------------------------------------------------------+
|  [Logo]                    [Buscar...]           [ES] [?] [Avatar v]   |
+------------------------------------------------------------------------+
|         |                                                              |
| MENU    |  Bienvenido, Juan                                            |
|         |  __________________                                          |
| [*] Dashboard                                                          |
| [ ] Mis busquedas |  +-------------------+  +-------------------+      |
| [ ] Solicitudes   |  |  Busquedas        |  |  Resultados       |      |
| [ ] Ajustes       |  |  este mes         |  |  pendientes       |      |
|         |         |  |                   |  |                   |      |
| ________|         |  |      12           |  |      45           |      |
|         |         |  |                   |  |                   |      |
| Plan: Free        |  |  de 30 permitidas |  |  sin revisar      |      |
| [Mejorar plan]    |  +-------------------+  +-------------------+      |
|         |                                                              |
|         |  +-------------------+  +-------------------+                |
|         |  |  Solicitudes GDPR |  |  Alertas          |                |
|         |  |  activas          |  |  criticas         |                |
|         |  |                   |  |                   |                |
|         |  |       3           |  |       2           |                |
|         |  |                   |  |                   |                |
|         |  |  esperando resp.  |  |  requieren accion |                |
|         |  +-------------------+  +-------------------+                |
|         |                                                              |
|         |  Nueva busqueda                                              |
|         |  _______________                                             |
|         |                                                              |
|         |  +----------------------------------------------------+     |
|         |  |                                                    |     |
|         |  |  Nombre completo *                                 |     |
|         |  |  [Juan Garcia Lopez                           ]    |     |
|         |  |                                                    |     |
|         |  |  Email (opcional)                                  |     |
|         |  |  [juan@ejemplo.com                            ]    |     |
|         |  |                                                    |     |
|         |  |  Usernames (opcional)                              |     |
|         |  |  [juangarcia] [jgarcia92] [+]                      |     |
|         |  |                                                    |     |
|         |  |           [   Iniciar busqueda   ]                 |     |
|         |  |                                                    |     |
|         |  +----------------------------------------------------+     |
|         |                                                              |
|         |  Ultimas busquedas                                           |
|         |  _________________                                           |
|         |                                                              |
|         |  +----------------------------------------------------+     |
|         |  | 04 Feb | Juan Garcia | 15 resultados | Completada  |     |
|         |  +----------------------------------------------------+     |
|         |  | 02 Feb | Juan Garcia | 12 resultados | Completada  |     |
|         |  +----------------------------------------------------+     |
|         |  | 28 Ene | J. Garcia   |  8 resultados | Completada  |     |
|         |  +----------------------------------------------------+     |
|         |                                                              |
|         |  [Ver todas las busquedas ->]                                |
|         |                                                              |
+------------------------------------------------------------------------+
```

### 3.2 Mobile

```
+----------------------------------+
|  [=]  Huella Digital    [Avatar] |
+----------------------------------+
|                                  |
|  Hola, Juan                      |
|                                  |
|  +------------+ +------------+   |
|  | Busquedas  | | Resultados |   |
|  |    12      | |    45      |   |
|  | de 30      | | pendientes |   |
|  +------------+ +------------+   |
|                                  |
|  Nueva busqueda                  |
|  _______________                 |
|                                  |
|  Nombre completo *               |
|  [                          ]    |
|                                  |
|  Email (opcional)                |
|  [                          ]    |
|                                  |
|  Usernames                       |
|  [juangarcia    ] [x]            |
|  [+ Anadir username]             |
|                                  |
|  [    Iniciar busqueda     ]     |
|                                  |
|  Ultimas busquedas               |
|  _________________               |
|                                  |
|  +----------------------------+  |
|  | 04 Feb 2026                |  |
|  | Juan Garcia                |  |
|  | 15 resultados - Completada |  |
|  +----------------------------+  |
|                                  |
|  [Ver todas ->]                  |
|                                  |
+----------------------------------+
|  [Home] [Busq.] [Solic.] [Conf.] |
+----------------------------------+
```

---

## 4. Resultados de Busqueda

### 4.1 Desktop

```
+------------------------------------------------------------------------+
|  [Logo]                    [Buscar...]           [ES] [?] [Avatar v]   |
+------------------------------------------------------------------------+
|         |                                                              |
| MENU    |  Resultados de busqueda                                      |
|         |  _________________________                                   |
| [<] Volver                                                             |
|         |  Busqueda: "Juan Garcia" - 04 Feb 2026                       |
|         |  15 resultados encontrados                                   |
|         |                                                              |
|         |  Filtros:                                                    |
|         |  [Todos v] [Categoria v] [Severidad v] [Ordenar: Relevancia]|
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |                                                        | |
|         |  |  Resumen por severidad                                 | |
|         |  |                                                        | |
|         |  |  [====] Critica: 2    [========] Alta: 4               | |
|         |  |  [============] Media: 5    [========] Baja: 4         | |
|         |  |                                                        | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  | [!] CRITICA                              [Descartar]   | |
|         |  |                                                        | |
|         |  |  Data Breach: LinkedIn (2021)                          | |
|         |  |  Fuente: Have I Been Pwned                             | |
|         |  |                                                        | |
|         |  |  Tu email fue encontrado en la filtracion de datos     | |
|         |  |  de LinkedIn. Datos expuestos: emails, passwords,      | |
|         |  |  nombres.                                              | |
|         |  |                                                        | |
|         |  |  Fecha del breach: 22 Jun 2021                         | |
|         |  |                                                        | |
|         |  |  [Ver detalles]  [Crear solicitud GDPR]                | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  | [!] ALTA                                 [Descartar]   | |
|         |  |                                                        | |
|         |  |  Twitter: @juangarcia                                  | |
|         |  |  https://twitter.com/juangarcia                        | |
|         |  |  Fuente: Google Search                                 | |
|         |  |                                                        | |
|         |  |  "Juan Garcia (@juangarcia). 150 seguidores.           | |
|         |  |  Ingeniero de software. Madrid, Espana..."             | |
|         |  |                                                        | |
|         |  |  [Abrir enlace]  [Crear solicitud GDPR]                | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  | [ ] MEDIA                                [Descartar]   | |
|         |  |                                                        | |
|         |  |  GitHub: juangarcia                                    | |
|         |  |  https://github.com/juangarcia                         | |
|         |  |  Fuente: Username Search                               | |
|         |  |                                                        | |
|         |  |  [Abrir enlace]  [Crear solicitud GDPR]                | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  [Cargar mas resultados...]                                  |
|         |                                                              |
+------------------------------------------------------------------------+
```

### 4.2 Mobile

```
+----------------------------------+
|  [<]  Resultados        [Filtro] |
+----------------------------------+
|                                  |
|  "Juan Garcia" - 04 Feb          |
|  15 resultados                   |
|                                  |
|  +----------------------------+  |
|  | Critica: 2  |  Alta: 4    |  |
|  | Media: 5    |  Baja: 4    |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [!] CRITICA               |  |
|  |                           |  |
|  | Data Breach: LinkedIn     |  |
|  | Fuente: Have I Been Pwned |  |
|  |                           |  |
|  | Tu email fue encontrado   |  |
|  | en la filtracion de       |  |
|  | LinkedIn (22 Jun 2021)    |  |
|  |                           |  |
|  | [Ver mas] [Solicitud GDPR]|  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [!] ALTA                  |  |
|  |                           |  |
|  | Twitter: @juangarcia      |  |
|  | twitter.com/juangarcia    |  |
|  |                           |  |
|  | "Juan Garcia. 150         |  |
|  | seguidores. Ingeniero..." |  |
|  |                           |  |
|  | [Abrir] [Solicitud GDPR]  |  |
|  +----------------------------+  |
|                                  |
|  [Cargar mas...]                 |
|                                  |
+----------------------------------+
|  [Home] [Busq.] [Solic.] [Conf.] |
+----------------------------------+
```

---

## 5. Detalle de Resultado

### 5.1 Modal/Drawer

```
+----------------------------------------------------+
|  [x]                                    Resultado   |
+----------------------------------------------------+
|                                                     |
|  [!] Severidad: CRITICA                             |
|                                                     |
|  Data Breach: LinkedIn                              |
|  _________________________                          |
|                                                     |
|  Fuente: Have I Been Pwned                          |
|  Fecha del breach: 22 Junio 2021                    |
|  Confianza: 100%                                    |
|                                                     |
|  Descripcion                                        |
|  ___________                                        |
|                                                     |
|  En junio de 2021, LinkedIn sufrio una brecha       |
|  de seguridad que expuso datos de 700 millones      |
|  de usuarios. Tu email juan@ejemplo.com fue         |
|  encontrado en esta filtracion.                     |
|                                                     |
|  Datos expuestos                                    |
|  _______________                                    |
|                                                     |
|  * Direcciones de email                             |
|  * Contrasenas (hash)                               |
|  * Nombres completos                                |
|  * Numeros de telefono                              |
|  * Ubicaciones geograficas                          |
|                                                     |
|  Recomendaciones                                    |
|  ________________                                   |
|                                                     |
|  1. Cambia tu contrasena de LinkedIn                |
|  2. Activa autenticacion de dos factores            |
|  3. Revisa si usas la misma contrasena en otros     |
|     servicios y cambiala                            |
|                                                     |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  |  [   Descartar resultado   ]                  |  |
|  |                                               |  |
|  |  [   Crear solicitud GDPR   ]                 |  |
|  |                                               |  |
|  +-----------------------------------------------+  |
|                                                     |
+----------------------------------------------------+
```

---

## 6. Generador de Solicitud GDPR

### 6.1 Paso 1: Seleccion de Template

```
+------------------------------------------------------------------------+
|  [<] Volver                                   Crear solicitud GDPR     |
+------------------------------------------------------------------------+
|                                                                        |
|  Paso 1 de 3: Tipo de solicitud                                        |
|  [=====>                                        ]                      |
|                                                                        |
|  Selecciona el tipo de solicitud que deseas generar:                   |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  ( ) Derecho de supresion (Art. 17)                              | |
|  |      Solicitar la eliminacion de tus datos personales            | |
|  |      Recomendado para este resultado                             | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  ( ) Derecho de acceso (Art. 15)                                 | |
|  |      Solicitar informacion sobre que datos tienen tuyos          | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  ( ) Derecho de rectificacion (Art. 16)                          | |
|  |      Solicitar la correccion de datos incorrectos                | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  ( ) Derecho de portabilidad (Art. 20)                           | |
|  |      Solicitar una copia de tus datos en formato portable        | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|                                                                        |
|  [           Cancelar           ]  [         Siguiente >         ]    |
|                                                                        |
+------------------------------------------------------------------------+
```

### 6.2 Paso 2: Datos del Destinatario

```
+------------------------------------------------------------------------+
|  [<] Volver                                   Crear solicitud GDPR     |
+------------------------------------------------------------------------+
|                                                                        |
|  Paso 2 de 3: Destinatario                                             |
|  [==================>                          ]                       |
|                                                                        |
|  A quien se enviara esta solicitud:                                    |
|                                                                        |
|  Entidad/Empresa *                                                     |
|  [Twitter, Inc. (X Corp)                                          ]   |
|  [Sugerencias: Twitter, Inc. | X Corp | ...]                          |
|                                                                        |
|  Email del DPO o contacto de privacidad *                              |
|  [privacy@twitter.com                                             ]   |
|  [i] Hemos encontrado este email automaticamente                      |
|                                                                        |
|  Direccion postal (opcional)                                           |
|  [                                                                ]   |
|                                                                        |
|  Pais                                                                  |
|  [Estados Unidos                                               v ]   |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  [i] Informacion del resultado asociado:                         | |
|  |      URL: https://twitter.com/juangarcia                         | |
|  |      Tipo: Perfil de red social                                  | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|                                                                        |
|  [         < Anterior           ]  [         Siguiente >         ]    |
|                                                                        |
+------------------------------------------------------------------------+
```

### 6.3 Paso 3: Revisar y Generar

```
+------------------------------------------------------------------------+
|  [<] Volver                                   Crear solicitud GDPR     |
+------------------------------------------------------------------------+
|                                                                        |
|  Paso 3 de 3: Revisar y generar                                        |
|  [=======================================>     ]                       |
|                                                                        |
|  Vista previa de tu solicitud:                                         |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  Asunto: Solicitud de supresion de datos personales - RGPD       | |
|  |          Art. 17                                                 | |
|  |                                                                  | |
|  |  --------------------------------------------------------------- | |
|  |                                                                  | |
|  |  Estimado/a responsable de proteccion de datos,                  | |
|  |                                                                  | |
|  |  Por medio de la presente, y en ejercicio del derecho de         | |
|  |  supresion reconocido en el articulo 17 del Reglamento           | |
|  |  General de Proteccion de Datos (RGPD), solicito la              | |
|  |  eliminacion de todos mis datos personales que obran en          | |
|  |  sus sistemas.                                                   | |
|  |                                                                  | |
|  |  Datos del solicitante:                                          | |
|  |  - Nombre completo: Juan Garcia Lopez                            | |
|  |  - Correo electronico: juan@ejemplo.com                          | |
|  |  - Fecha de la solicitud: 04 de febrero de 2026                  | |
|  |                                                                  | |
|  |  Datos a eliminar:                                               | |
|  |  Mi perfil publico (@juangarcia) y todos los tweets asociados.   | |
|  |                                                                  | |
|  |  [...]                                                           | |
|  |                                                                  | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  Notas adicionales (opcional)                                          |
|  [                                                                ]   |
|                                                                        |
|  [ ] Generar PDF para descargar                                        |
|                                                                        |
|                                                                        |
|  [         < Anterior           ]  [     Crear solicitud     ]        |
|                                                                        |
+------------------------------------------------------------------------+
```

---

## 7. Tracker de Solicitudes

### 7.1 Lista de Solicitudes

```
+------------------------------------------------------------------------+
|  [Logo]                    [Buscar...]           [ES] [?] [Avatar v]   |
+------------------------------------------------------------------------+
|         |                                                              |
| MENU    |  Mis solicitudes GDPR                                        |
|         |  ____________________                                        |
|         |                                                              |
|         |  Filtros: [Todas v] [Tipo v] [Estado v]                      |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |  Resumen                                               | |
|         |  |                                                        | |
|         |  |  [  ] Borrador: 1   [  ] Lista: 2   [  ] Enviada: 3   | |
|         |  |  [  ] Respondida: 1   [  ] Completada: 2               | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |  [*] Twitter, Inc.                          ENVIADA   | |
|         |  |      Solicitud de supresion                           | |
|         |  |      Enviada: 04 Feb 2026                             | |
|         |  |                                                        | |
|         |  |      [!] Plazo: 26 dias restantes                      | |
|         |  |                                                        | |
|         |  |      [Ver detalles]  [Marcar respondida]               | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |  [*] LinkedIn                              ENVIADA    | |
|         |  |      Solicitud de supresion                           | |
|         |  |      Enviada: 01 Feb 2026                             | |
|         |  |                                                        | |
|         |  |      [!] Plazo: 23 dias restantes                      | |
|         |  |                                                        | |
|         |  |      [Ver detalles]  [Marcar respondida]               | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |  [ ] Google                               COMPLETADA  | |
|         |  |      Solicitud de supresion                           | |
|         |  |      Enviada: 15 Ene 2026 | Respondida: 28 Ene 2026   | |
|         |  |                                                        | |
|         |  |      [v] Datos eliminados correctamente                | |
|         |  |                                                        | |
|         |  |      [Ver detalles]                                    | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
+------------------------------------------------------------------------+
```

### 7.2 Detalle de Solicitud (con Timeline)

```
+----------------------------------------------------+
|  [<] Volver                         Solicitud GDPR |
+----------------------------------------------------+
|                                                    |
|  Twitter, Inc.                                     |
|  Solicitud de supresion (Art. 17)                  |
|  ___________________________________               |
|                                                    |
|  Estado: ENVIADA                                   |
|  Plazo legal: 26 dias restantes                    |
|                                                    |
|  Timeline                                          |
|  ________                                          |
|                                                    |
|  [*]----[*]----[ ]----[ ]----[ ]                   |
|  Creada Enviada Recib. Resuelta                    |
|                                                    |
|  04 Feb 2026 10:30                                 |
|  [*] Solicitud creada                              |
|                                                    |
|  04 Feb 2026 12:00                                 |
|  [*] Solicitud enviada por email                   |
|      a privacy@twitter.com                         |
|                                                    |
|  04 Mar 2026 (estimado)                            |
|  [ ] Plazo legal de respuesta                      |
|                                                    |
|  Documento                                         |
|  _________                                         |
|                                                    |
|  [Descargar PDF]  [Ver texto completo]             |
|                                                    |
|  Acciones                                          |
|  ________                                          |
|                                                    |
|  [   Marcar como respondida   ]                    |
|                                                    |
|  [   Escalar a AEPD   ]                            |
|                                                    |
|  Notas                                             |
|  _____                                             |
|                                                    |
|  [Anadir nota...]                                  |
|                                                    |
+----------------------------------------------------+
```

---

## 8. Settings/Perfil

### 8.1 Desktop

```
+------------------------------------------------------------------------+
|  [Logo]                    [Buscar...]           [ES] [?] [Avatar v]   |
+------------------------------------------------------------------------+
|         |                                                              |
| MENU    |  Ajustes                                                     |
|         |  _______                                                     |
|         |                                                              |
|         |  [Perfil] [Seguridad] [Privacidad] [Notificaciones] [Plan]   |
|         |                                                              |
|         |  Perfil                                                      |
|         |  ______                                                      |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |                                                        | |
|         |  |  Avatar                                                | |
|         |  |  [   JG   ]   [Cambiar foto]                           | |
|         |  |                                                        | |
|         |  |  Nombre completo                                       | |
|         |  |  [Juan Garcia Lopez                               ]    | |
|         |  |                                                        | |
|         |  |  Email                                                 | |
|         |  |  [juan@ejemplo.com                                ]    | |
|         |  |  [i] Para cambiar el email, contacta soporte          | |
|         |  |                                                        | |
|         |  |  Idioma                                                | |
|         |  |  [Espanol                                       v ]    | |
|         |  |                                                        | |
|         |  |  Tema                                                  | |
|         |  |  ( ) Claro  ( ) Oscuro  (*) Sistema                    | |
|         |  |                                                        | |
|         |  |              [   Guardar cambios   ]                   | |
|         |  |                                                        | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
|         |  Zona de peligro                                             |
|         |  ________________                                            |
|         |                                                              |
|         |  +--------------------------------------------------------+ |
|         |  |                                                        | |
|         |  |  Exportar mis datos                                    | |
|         |  |  Descarga todos tus datos en formato JSON              | |
|         |  |  [   Exportar datos   ]                                | |
|         |  |                                                        | |
|         |  |  ---------------------------------------------------   | |
|         |  |                                                        | |
|         |  |  Eliminar mi cuenta                                    | |
|         |  |  Esta accion es irreversible. Se eliminaran todos      | |
|         |  |  tus datos, busquedas y solicitudes.                   | |
|         |  |  [   Eliminar cuenta   ]                               | |
|         |  |                                                        | |
|         |  +--------------------------------------------------------+ |
|         |                                                              |
+------------------------------------------------------------------------+
```

---

## 9. Componentes Reutilizables

### 9.1 Componentes de UI Base (shadcn/ui)

| Componente | Uso |
|------------|-----|
| Button | Acciones primarias y secundarias |
| Input | Campos de texto |
| Select | Selectores y dropdowns |
| Card | Contenedores de informacion |
| Dialog/Drawer | Modales y paneles laterales |
| Badge | Etiquetas de estado y severidad |
| Tabs | Navegacion secundaria |
| Table | Listados de datos |
| Toast | Notificaciones |
| Skeleton | Estados de carga |

### 9.2 Componentes Personalizados

```
components/
|-- search/
|   |-- SearchForm.tsx           # Formulario de nueva busqueda
|   |-- SearchCard.tsx           # Tarjeta de busqueda en lista
|   |-- SearchStatus.tsx         # Indicador de estado de busqueda
|   |-- SearchProgress.tsx       # Barra de progreso durante busqueda
|
|-- results/
|   |-- ResultCard.tsx           # Tarjeta de resultado individual
|   |-- ResultDetail.tsx         # Modal/drawer de detalle
|   |-- ResultFilters.tsx        # Filtros de resultados
|   |-- SeverityBadge.tsx        # Badge de severidad (critica/alta/media/baja)
|   |-- CategoryBadge.tsx        # Badge de categoria
|   |-- SourceBadge.tsx          # Badge de fuente (Google, HIBP, etc.)
|
|-- gdpr/
|   |-- TemplateSelector.tsx     # Selector de tipo de solicitud
|   |-- RecipientForm.tsx        # Formulario de destinatario
|   |-- RequestPreview.tsx       # Vista previa de solicitud
|   |-- RequestCard.tsx          # Tarjeta de solicitud en tracker
|   |-- RequestTimeline.tsx      # Timeline de estados
|   |-- StatusBadge.tsx          # Badge de estado de solicitud
|
|-- layout/
|   |-- Sidebar.tsx              # Menu lateral (desktop)
|   |-- MobileNav.tsx            # Navegacion inferior (mobile)
|   |-- Header.tsx               # Cabecera con busqueda y usuario
|   |-- Footer.tsx               # Pie de pagina
|
|-- common/
|   |-- EmptyState.tsx           # Estado vacio con ilustracion
|   |-- LoadingState.tsx         # Estado de carga con skeleton
|   |-- ErrorState.tsx           # Estado de error con retry
|   |-- ConfirmDialog.tsx        # Dialogo de confirmacion
|   |-- LanguageSwitcher.tsx     # Selector de idioma
|   |-- ThemeSwitcher.tsx        # Selector de tema
```

### 9.3 Colores Semanticos

```css
:root {
  /* Severidad */
  --severity-critical: #ef4444; /* red-500 */
  --severity-high: #f97316;     /* orange-500 */
  --severity-medium: #eab308;   /* yellow-500 */
  --severity-low: #22c55e;      /* green-500 */
  
  /* Estados de solicitud */
  --status-draft: #6b7280;      /* gray-500 */
  --status-ready: #3b82f6;      /* blue-500 */
  --status-sent: #8b5cf6;       /* violet-500 */
  --status-acknowledged: #06b6d4; /* cyan-500 */
  --status-completed: #22c55e;  /* green-500 */
  --status-rejected: #ef4444;   /* red-500 */
  --status-escalated: #f97316;  /* orange-500 */
  
  /* Categorias */
  --category-social: #3b82f6;   /* blue-500 */
  --category-breach: #ef4444;   /* red-500 */
  --category-forum: #8b5cf6;    /* violet-500 */
  --category-news: #06b6d4;     /* cyan-500 */
  --category-professional: #10b981; /* emerald-500 */
  --category-government: #6366f1; /* indigo-500 */
  --category-other: #6b7280;    /* gray-500 */
}
```

---

## 10. Flujos de Usuario

### 10.1 Flujo: Primera Busqueda

```
Landing -> Registro -> Onboarding -> Dashboard -> Nueva Busqueda
   |                       |              |            |
   v                       v              v            v
[CTA]     [Email/Pass]  [Nombre,     [Form con    [Loader,
          [Magic Link]   Idioma,      datos       webhook,
                         GDPR]        pre-fill]   resultados]
```

### 10.2 Flujo: Crear Solicitud GDPR

```
Resultados -> Detalle -> Crear GDPR -> Paso 1 -> Paso 2 -> Paso 3 -> Tracker
     |           |           |           |          |          |         |
     v           v           v           v          v          v         v
[Lista]    [Modal]     [Boton]     [Tipo]    [Destino]  [Preview]  [Seguim.]
```

### 10.3 Flujo: Seguimiento de Solicitud

```
Tracker -> Detalle -> Actualizar Estado -> Notificacion
   |          |             |                   |
   v          v             v                   v
[Lista]   [Timeline]   [Marcar:          [Email/Push:
                        enviada,          recordatorio,
                        respondida,       plazo vencido]
                        completada]
```

---

*UI Wireframes generados para Huella Digital - 2026-02-04*
