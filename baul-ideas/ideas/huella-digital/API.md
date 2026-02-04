# API Reference - Huella Digital

> Documentacion completa de la API REST.

**Version:** 1.0  
**Base URL:** `https://api.huelladigital.app/v1`  
**Formato:** JSON  
**Autenticacion:** Bearer Token (Supabase JWT)

---

## 1. Autenticacion

### 1.1 Flujo de Autenticacion

La autenticacion se gestiona via Supabase Auth. Los endpoints de la API requieren un JWT valido.

```
Authorization: Bearer <supabase_access_token>
```

### 1.2 Obtener Token

El token se obtiene a traves de Supabase Auth SDK en el frontend:

```typescript
// Cliente Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'contrasena'
});

// El token esta en data.session.access_token
```

### 1.3 Respuestas de Error de Auth

| Codigo | Descripcion |
|--------|-------------|
| 401 | Token ausente, invalido o expirado |
| 403 | Sin permisos para el recurso |

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de acceso invalido o expirado"
  }
}
```

---

## 2. Rate Limiting

### 2.1 Limites por Plan

| Plan | Requests/min | Busquedas/dia |
|------|--------------|---------------|
| Free | 60 | 3 |
| Pro | 120 | 30 |
| Enterprise | 300 | Ilimitado |

### 2.2 Headers de Rate Limit

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706961600
```

### 2.3 Respuesta cuando se excede

```json
// HTTP 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Has excedido el limite de peticiones. Intenta de nuevo en 45 segundos.",
    "retryAfter": 45
  }
}
```

---

## 3. Formato de Respuestas

### 3.1 Respuesta Exitosa

```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-02-04T10:30:00Z"
  }
}
```

### 3.2 Respuesta con Paginacion

```json
{
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

### 3.3 Respuesta de Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son validos",
    "details": [
      {
        "field": "email",
        "message": "Formato de email invalido"
      }
    ]
  }
}
```

---

## 4. Endpoints

### 4.1 Usuario

#### GET /user/profile

Obtiene el perfil del usuario autenticado.

**Request:**
```bash
curl -X GET https://api.huelladigital.app/v1/user/profile \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "fullName": "Juan Garcia",
    "language": "es",
    "plan": "free",
    "searchesToday": 2,
    "searchesLimit": 3,
    "onboardingCompleted": true,
    "createdAt": "2026-01-15T08:00:00Z"
  }
}
```

---

#### PATCH /user/profile

Actualiza el perfil del usuario.

**Request:**
```bash
curl -X PATCH https://api.huelladigital.app/v1/user/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Garcia Lopez",
    "language": "en"
  }'
```

**Body Schema:**
```typescript
{
  fullName?: string;       // max 100 caracteres
  language?: "es" | "en";
  marketingConsent?: boolean;
}
```

**Response (200):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Juan Garcia Lopez",
    "language": "en",
    "updatedAt": "2026-02-04T10:30:00Z"
  }
}
```

---

#### DELETE /user/account

Elimina la cuenta del usuario y todos sus datos.

**Request:**
```bash
curl -X DELETE https://api.huelladigital.app/v1/user/account \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmation": "ELIMINAR MI CUENTA"
  }'
```

**Response (200):**
```json
{
  "data": {
    "message": "Cuenta eliminada correctamente",
    "deletedAt": "2026-02-04T10:30:00Z"
  }
}
```

---

#### GET /user/export

Exporta todos los datos del usuario (GDPR Art. 20).

**Request:**
```bash
curl -X GET https://api.huelladigital.app/v1/user/export \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "exportUrl": "https://storage.huelladigital.app/exports/abc123.json",
    "expiresAt": "2026-02-05T10:30:00Z",
    "format": "json"
  }
}
```

---

### 4.2 Busquedas

#### POST /searches

Crea una nueva busqueda de huella digital.

**Request:**
```bash
curl -X POST https://api.huelladigital.app/v1/searches \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "queryName": "Juan Garcia",
    "queryEmail": "juan@ejemplo.com",
    "queryUsernames": ["juangarcia", "jgarcia92"]
  }'
```

**Body Schema:**
```typescript
{
  queryName: string;           // requerido, 2-100 caracteres
  queryEmail?: string;         // email valido
  queryUsernames?: string[];   // max 5 usernames, cada uno 3-30 caracteres
}
```

**Response (202 Accepted):**
```json
{
  "data": {
    "id": "search_abc123",
    "status": "pending",
    "queryName": "Juan Garcia",
    "queryEmail": "j***@ejemplo.com",
    "queryUsernames": ["juangarcia", "jgarcia92"],
    "estimatedTime": 45,
    "createdAt": "2026-02-04T10:30:00Z"
  }
}
```

**Errores:**
| Codigo | Descripcion |
|--------|-------------|
| 400 | Datos de busqueda invalidos |
| 402 | Limite diario de busquedas alcanzado |
| 429 | Cooldown activo entre busquedas |

---

#### GET /searches

Lista las busquedas del usuario.

**Request:**
```bash
curl -X GET "https://api.huelladigital.app/v1/searches?page=1&pageSize=10&status=completed" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| page | number | 1 | Pagina actual |
| pageSize | number | 10 | Resultados por pagina (max 50) |
| status | string | - | Filtrar por estado |
| sortBy | string | createdAt | Campo de ordenacion |
| sortOrder | string | desc | asc o desc |

**Response (200):**
```json
{
  "data": [
    {
      "id": "search_abc123",
      "status": "completed",
      "queryName": "Juan Garcia",
      "totalResults": 15,
      "resultsByCategory": {
        "social_media": 5,
        "data_breach": 3,
        "news": 2,
        "forum": 3,
        "other": 2
      },
      "resultsBySeverity": {
        "critical": 1,
        "high": 3,
        "medium": 5,
        "low": 6
      },
      "createdAt": "2026-02-04T10:30:00Z",
      "completedAt": "2026-02-04T10:31:15Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  }
}
```

---

#### GET /searches/:id

Obtiene una busqueda especifica con sus resultados.

**Request:**
```bash
curl -X GET https://api.huelladigital.app/v1/searches/search_abc123 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "id": "search_abc123",
    "status": "completed",
    "queryName": "Juan Garcia",
    "queryEmail": "j***@ejemplo.com",
    "queryUsernames": ["juangarcia", "jgarcia92"],
    "totalResults": 15,
    "resultsByCategory": { ... },
    "resultsBySeverity": { ... },
    "sourcesQueried": ["google", "hibp", "github", "reddit"],
    "sourcesCompleted": ["google", "hibp", "github", "reddit"],
    "sourcesFailed": [],
    "createdAt": "2026-02-04T10:30:00Z",
    "completedAt": "2026-02-04T10:31:15Z",
    "expiresAt": "2026-03-06T10:30:00Z"
  }
}
```

---

#### DELETE /searches/:id

Elimina una busqueda y todos sus resultados.

**Request:**
```bash
curl -X DELETE https://api.huelladigital.app/v1/searches/search_abc123 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "message": "Busqueda eliminada correctamente",
    "deletedResults": 15
  }
}
```

---

### 4.3 Resultados

#### GET /searches/:id/results

Lista los resultados de una busqueda.

**Request:**
```bash
curl -X GET "https://api.huelladigital.app/v1/searches/search_abc123/results?category=social_media&severity=high" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| page | number | 1 | Pagina actual |
| pageSize | number | 20 | Resultados por pagina |
| category | string | - | Filtrar por categoria |
| severity | string | - | Filtrar por severidad |
| source | string | - | Filtrar por fuente |
| dismissed | boolean | false | Incluir descartados |

**Response (200):**
```json
{
  "data": [
    {
      "id": "result_xyz789",
      "source": "google",
      "url": "https://twitter.com/juangarcia",
      "title": "Juan Garcia (@juangarcia) / Twitter",
      "snippet": "Perfil de Twitter de Juan Garcia. 150 seguidores...",
      "category": "social_media",
      "severity": "medium",
      "confidenceScore": 0.85,
      "isDismissed": false,
      "hasGdprRequest": false,
      "foundAt": "2026-02-04T10:30:45Z"
    },
    {
      "id": "result_xyz790",
      "source": "hibp",
      "url": null,
      "title": "Data Breach: LinkedIn (2021)",
      "snippet": "Tu email fue encontrado en la filtracion de LinkedIn de 2021",
      "category": "data_breach",
      "severity": "critical",
      "confidenceScore": 1.0,
      "breachName": "LinkedIn",
      "breachDate": "2021-06-22",
      "breachDataClasses": ["emails", "passwords", "names"],
      "isDismissed": false,
      "hasGdprRequest": false,
      "foundAt": "2026-02-04T10:30:48Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

---

#### PATCH /searches/:searchId/results/:resultId

Actualiza un resultado (ej: descartar).

**Request:**
```bash
curl -X PATCH https://api.huelladigital.app/v1/searches/search_abc123/results/result_xyz789 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isDismissed": true
  }'
```

**Body Schema:**
```typescript
{
  isDismissed?: boolean;
}
```

**Response (200):**
```json
{
  "data": {
    "id": "result_xyz789",
    "isDismissed": true,
    "dismissedAt": "2026-02-04T11:00:00Z"
  }
}
```

---

### 4.4 Solicitudes GDPR

#### GET /gdpr/templates

Lista los templates disponibles para solicitudes GDPR.

**Request:**
```bash
curl -X GET "https://api.huelladigital.app/v1/gdpr/templates?type=erasure&language=es" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| type | string | - | Filtrar por tipo (erasure, access, rectification) |
| language | string | - | Filtrar por idioma (es, en) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "template_001",
      "type": "erasure",
      "language": "es",
      "name": "Solicitud de supresion estandar",
      "description": "Template general para solicitar eliminacion de datos personales",
      "legalBasis": "RGPD Articulo 17 - Derecho de supresion",
      "isDefault": true
    },
    {
      "id": "template_002",
      "type": "erasure",
      "language": "es",
      "name": "Solicitud urgente",
      "description": "Template para casos que requieren atencion inmediata",
      "legalBasis": "RGPD Articulo 17 - Derecho de supresion",
      "isDefault": false
    }
  ]
}
```

---

#### POST /gdpr/requests

Crea una nueva solicitud GDPR.

**Request:**
```bash
curl -X POST https://api.huelladigital.app/v1/gdpr/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "searchResultId": "result_xyz789",
    "templateId": "template_001",
    "requestType": "erasure",
    "targetEntity": "Twitter, Inc.",
    "targetEmail": "privacy@twitter.com",
    "customizations": {
      "targetDataDescription": "Mi perfil publico y todos los tweets asociados"
    }
  }'
```

**Body Schema:**
```typescript
{
  searchResultId?: string;              // ID del resultado asociado
  templateId: string;                   // ID del template a usar
  requestType: "erasure" | "access" | "rectification" | "portability";
  targetEntity: string;                 // Nombre de la empresa
  targetEmail?: string;                 // Email del DPO
  targetAddress?: string;               // Direccion postal
  targetCountry?: string;               // Pais (ISO 3166-1)
  customizations?: {
    targetDataDescription?: string;     // Descripcion de datos a eliminar
    additionalNotes?: string;           // Notas adicionales
  };
  generatePdf?: boolean;                // Default: true
}
```

**Response (201):**
```json
{
  "data": {
    "id": "gdpr_req_001",
    "status": "ready",
    "requestType": "erasure",
    "targetEntity": "Twitter, Inc.",
    "targetEmail": "privacy@twitter.com",
    "subject": "Solicitud de supresion de datos personales - RGPD Art. 17",
    "body": "Estimado/a responsable de proteccion de datos...",
    "pdfUrl": "https://storage.huelladigital.app/pdfs/gdpr_req_001.pdf",
    "pdfExpiresAt": "2026-02-11T10:30:00Z",
    "createdAt": "2026-02-04T10:30:00Z"
  }
}
```

---

#### GET /gdpr/requests

Lista las solicitudes GDPR del usuario.

**Request:**
```bash
curl -X GET "https://api.huelladigital.app/v1/gdpr/requests?status=sent&page=1" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| page | number | 1 | Pagina actual |
| pageSize | number | 20 | Resultados por pagina |
| status | string | - | Filtrar por estado |
| requestType | string | - | Filtrar por tipo |

**Response (200):**
```json
{
  "data": [
    {
      "id": "gdpr_req_001",
      "status": "sent",
      "requestType": "erasure",
      "targetEntity": "Twitter, Inc.",
      "targetEmail": "privacy@twitter.com",
      "sentAt": "2026-02-04T12:00:00Z",
      "daysRemaining": 26,
      "createdAt": "2026-02-04T10:30:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "statusCounts": {
      "draft": 1,
      "ready": 1,
      "sent": 2,
      "completed": 1
    }
  }
}
```

---

#### GET /gdpr/requests/:id

Obtiene una solicitud GDPR especifica.

**Request:**
```bash
curl -X GET https://api.huelladigital.app/v1/gdpr/requests/gdpr_req_001 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "id": "gdpr_req_001",
    "status": "sent",
    "requestType": "erasure",
    "targetEntity": "Twitter, Inc.",
    "targetEmail": "privacy@twitter.com",
    "targetAddress": null,
    "targetCountry": "US",
    "subject": "Solicitud de supresion de datos personales - RGPD Art. 17",
    "body": "Estimado/a responsable de proteccion de datos...",
    "pdfUrl": "https://storage.huelladigital.app/pdfs/gdpr_req_001.pdf",
    "pdfExpiresAt": "2026-02-11T10:30:00Z",
    "sentAt": "2026-02-04T12:00:00Z",
    "sentMethod": "email",
    "acknowledgedAt": null,
    "responseAt": null,
    "responseSummary": null,
    "escalatedTo": null,
    "nextReminderAt": "2026-03-04T12:00:00Z",
    "notes": null,
    "searchResult": {
      "id": "result_xyz789",
      "url": "https://twitter.com/juangarcia",
      "title": "Juan Garcia (@juangarcia) / Twitter"
    },
    "createdAt": "2026-02-04T10:30:00Z",
    "updatedAt": "2026-02-04T12:00:00Z"
  }
}
```

---

#### PATCH /gdpr/requests/:id

Actualiza el estado de una solicitud.

**Request:**
```bash
curl -X PATCH https://api.huelladigital.app/v1/gdpr/requests/gdpr_req_001 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent",
    "sentMethod": "email",
    "notes": "Enviado via formulario web de Twitter"
  }'
```

**Body Schema:**
```typescript
{
  status?: "draft" | "ready" | "sent" | "acknowledged" | "completed" | "rejected" | "escalated";
  sentAt?: string;           // ISO 8601
  sentMethod?: "email" | "postal" | "form";
  acknowledgedAt?: string;
  responseAt?: string;
  responseSummary?: string;
  escalatedTo?: string;      // 'aepd', 'cnil', etc.
  notes?: string;
}
```

**Response (200):**
```json
{
  "data": {
    "id": "gdpr_req_001",
    "status": "sent",
    "sentAt": "2026-02-04T12:00:00Z",
    "sentMethod": "email",
    "nextReminderAt": "2026-03-04T12:00:00Z",
    "updatedAt": "2026-02-04T12:00:00Z"
  }
}
```

---

#### POST /gdpr/requests/:id/regenerate-pdf

Regenera el PDF de una solicitud.

**Request:**
```bash
curl -X POST https://api.huelladigital.app/v1/gdpr/requests/gdpr_req_001/regenerate-pdf \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "pdfUrl": "https://storage.huelladigital.app/pdfs/gdpr_req_001_v2.pdf",
    "pdfExpiresAt": "2026-02-11T15:30:00Z"
  }
}
```

---

#### DELETE /gdpr/requests/:id

Elimina una solicitud GDPR (solo borradores).

**Request:**
```bash
curl -X DELETE https://api.huelladigital.app/v1/gdpr/requests/gdpr_req_002 \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": {
    "message": "Solicitud eliminada correctamente"
  }
}
```

**Error (400):**
```json
{
  "error": {
    "code": "CANNOT_DELETE",
    "message": "Solo se pueden eliminar solicitudes en estado borrador"
  }
}
```

---

### 4.5 Directorio de Contactos

#### GET /directory/entities

Lista entidades con informacion de contacto DPO.

**Request:**
```bash
curl -X GET "https://api.huelladigital.app/v1/directory/entities?query=twitter" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| query | string | - | Buscar por nombre |
| category | string | - | Filtrar por categoria |
| page | number | 1 | Pagina actual |

**Response (200):**
```json
{
  "data": [
    {
      "id": "entity_twitter",
      "name": "Twitter, Inc. (X Corp)",
      "category": "social_media",
      "dpoEmail": "privacy@twitter.com",
      "privacyUrl": "https://twitter.com/privacy",
      "deletionUrl": "https://help.twitter.com/forms/privacy",
      "country": "US",
      "gdprCompliant": true,
      "averageResponseDays": 14
    }
  ]
}
```

---

## 5. Webhooks (Opcional)

Para integraciones avanzadas, se pueden configurar webhooks.

### 5.1 Eventos Disponibles

| Evento | Descripcion |
|--------|-------------|
| search.completed | Busqueda finalizada |
| search.failed | Busqueda fallida |
| gdpr.reminder | Recordatorio de solicitud pendiente |

### 5.2 Payload de Webhook

```json
{
  "event": "search.completed",
  "timestamp": "2026-02-04T10:31:15Z",
  "data": {
    "searchId": "search_abc123",
    "totalResults": 15,
    "status": "completed"
  }
}
```

---

## 6. Codigos de Error

| Codigo | HTTP | Descripcion |
|--------|------|-------------|
| UNAUTHORIZED | 401 | Token invalido o expirado |
| FORBIDDEN | 403 | Sin permisos para el recurso |
| NOT_FOUND | 404 | Recurso no encontrado |
| VALIDATION_ERROR | 400 | Datos invalidos |
| RATE_LIMIT_EXCEEDED | 429 | Limite de peticiones excedido |
| SEARCH_LIMIT_EXCEEDED | 402 | Limite diario de busquedas |
| SEARCH_COOLDOWN | 429 | Esperar antes de nueva busqueda |
| CANNOT_DELETE | 400 | Operacion no permitida |
| INTERNAL_ERROR | 500 | Error interno del servidor |

---

*API Reference generada para Huella Digital - 2026-02-04*
