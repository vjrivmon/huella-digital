# Database Schema - Huella Digital

> Schema PostgreSQL completo para Supabase con RLS policies.

**Version:** 1.0  
**Fecha:** 2026-02-04  
**Database:** PostgreSQL 15 (Supabase)

---

## 1. Diagrama de Entidades

```
+------------------+       +------------------+       +-------------------+
|      users       |       |     searches     |       |  search_results   |
+------------------+       +------------------+       +-------------------+
| id (PK)          |<----->| id (PK)          |<----->| id (PK)           |
| email            |   1:N | user_id (FK)     |   1:N | search_id (FK)    |
| full_name        |       | query_name       |       | source            |
| encrypted_email  |       | query_email      |       | url               |
| language         |       | query_usernames  |       | title             |
| plan             |       | status           |       | snippet           |
| created_at       |       | created_at       |       | category          |
| updated_at       |       | completed_at     |       | severity          |
+------------------+       +------------------+       | found_at          |
        |                          |                  | metadata          |
        |                          |                  +-------------------+
        |                          |
        |                          v
        |                  +------------------+
        |                  | gdpr_requests    |
        |                  +------------------+
        |                  | id (PK)          |
        +----------------->| user_id (FK)     |
                           | search_result_id |
                           | template_id (FK) |
                           | request_type     |
                           | target_entity    |
                           | target_email     |
                           | status           |
                           | pdf_url          |
                           | sent_at          |
                           | response_at      |
                           | created_at       |
                           +------------------+
                                   |
                                   v
                           +-------------------+
                           | request_templates |
                           +-------------------+
                           | id (PK)           |
                           | type              |
                           | language          |
                           | name              |
                           | subject           |
                           | body              |
                           | legal_basis       |
                           | created_at        |
                           +-------------------+
```

---

## 2. Schema SQL Completo

### 2.1 Extensiones y Tipos

```sql
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos enumerados
CREATE TYPE user_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE user_language AS ENUM ('es', 'en');
CREATE TYPE search_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE result_category AS ENUM (
    'social_media',
    'forum',
    'news',
    'data_breach',
    'professional',
    'government',
    'other'
);
CREATE TYPE result_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE gdpr_request_type AS ENUM ('erasure', 'access', 'rectification', 'portability');
CREATE TYPE gdpr_request_status AS ENUM (
    'draft',
    'ready',
    'sent',
    'acknowledged',
    'completed',
    'rejected',
    'escalated'
);
```

### 2.2 Tabla: users

```sql
-- Extiende auth.users de Supabase
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    encrypted_email TEXT, -- Email cifrado para busquedas propias
    language user_language DEFAULT 'es',
    plan user_plan DEFAULT 'free',
    searches_today INTEGER DEFAULT 0,
    searches_reset_at TIMESTAMPTZ DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    gdpr_consent_at TIMESTAMPTZ,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios
COMMENT ON TABLE public.users IS 'Perfil extendido de usuarios';
COMMENT ON COLUMN public.users.encrypted_email IS 'Email cifrado para verificar busquedas propias';
COMMENT ON COLUMN public.users.searches_today IS 'Contador de busquedas del dia actual';
```

### 2.3 Tabla: searches

```sql
CREATE TABLE public.searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Datos de busqueda (cifrados en app layer)
    query_name TEXT NOT NULL,
    query_email TEXT,
    query_usernames TEXT[], -- Array de usernames a buscar
    
    -- Estado
    status search_status DEFAULT 'pending',
    error_message TEXT,
    
    -- Resultados agregados
    total_results INTEGER DEFAULT 0,
    results_by_category JSONB DEFAULT '{}',
    results_by_severity JSONB DEFAULT '{}',
    
    -- Fuentes consultadas
    sources_queried TEXT[] DEFAULT '{}',
    sources_completed TEXT[] DEFAULT '{}',
    sources_failed TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT
);

-- Comentarios
COMMENT ON TABLE public.searches IS 'Busquedas de huella digital';
COMMENT ON COLUMN public.searches.expires_at IS 'Fecha de expiracion para limpieza automatica';
```

### 2.4 Tabla: search_results

```sql
CREATE TABLE public.search_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_id UUID NOT NULL REFERENCES public.searches(id) ON DELETE CASCADE,
    
    -- Origen
    source TEXT NOT NULL, -- 'google', 'hibp', 'github', etc.
    source_query TEXT, -- Query especifica usada
    
    -- Datos del resultado
    url TEXT,
    title TEXT,
    snippet TEXT,
    thumbnail_url TEXT,
    
    -- Clasificacion
    category result_category DEFAULT 'other',
    severity result_severity DEFAULT 'low',
    confidence_score DECIMAL(3,2) DEFAULT 0.5, -- 0.00 a 1.00
    
    -- Para data breaches (HIBP)
    breach_name TEXT,
    breach_date DATE,
    breach_data_classes TEXT[],
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    found_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Estado de accion
    is_dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    has_gdpr_request BOOLEAN DEFAULT FALSE
);

-- Comentarios
COMMENT ON TABLE public.search_results IS 'Resultados individuales de busquedas';
COMMENT ON COLUMN public.search_results.confidence_score IS 'Probabilidad de que sea sobre el usuario (0-1)';
```

### 2.5 Tabla: gdpr_requests

```sql
CREATE TABLE public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    search_result_id UUID REFERENCES public.search_results(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.request_templates(id),
    
    -- Tipo de solicitud
    request_type gdpr_request_type NOT NULL,
    
    -- Destinatario
    target_entity TEXT NOT NULL, -- Nombre de la empresa/sitio
    target_email TEXT, -- Email del DPO o contacto
    target_address TEXT, -- Direccion postal si aplica
    target_country TEXT,
    
    -- Contenido generado
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    pdf_url TEXT, -- URL en Supabase Storage
    pdf_expires_at TIMESTAMPTZ,
    
    -- Estado y seguimiento
    status gdpr_request_status DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    sent_method TEXT, -- 'email', 'postal', 'form'
    acknowledged_at TIMESTAMPTZ,
    response_at TIMESTAMPTZ,
    response_summary TEXT,
    
    -- Escalamiento
    escalated_to TEXT, -- 'aepd', 'cnil', etc.
    escalated_at TIMESTAMPTZ,
    
    -- Recordatorios
    reminder_sent_at TIMESTAMPTZ,
    next_reminder_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Notas del usuario
    notes TEXT
);

-- Comentarios
COMMENT ON TABLE public.gdpr_requests IS 'Solicitudes GDPR generadas y su seguimiento';
COMMENT ON COLUMN public.gdpr_requests.next_reminder_at IS 'Proxima fecha para recordatorio automatico';
```

### 2.6 Tabla: request_templates

```sql
CREATE TABLE public.request_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificacion
    type gdpr_request_type NOT NULL,
    language user_language NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Contenido
    subject TEXT NOT NULL,
    body TEXT NOT NULL, -- Con placeholders: {{user_name}}, {{target_entity}}, etc.
    
    -- Legal
    legal_basis TEXT NOT NULL, -- Articulo GDPR aplicable
    legal_notes TEXT,
    
    -- Metadata
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(type, language, is_default) -- Solo un default por tipo/idioma
);

-- Comentarios
COMMENT ON TABLE public.request_templates IS 'Templates predefinidos para solicitudes GDPR';
COMMENT ON COLUMN public.request_templates.body IS 'Cuerpo con placeholders: {{user_name}}, {{user_email}}, {{target_entity}}, {{date}}';
```

### 2.7 Tabla: audit_logs (opcional)

```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    action TEXT NOT NULL, -- 'search.create', 'gdpr.send', etc.
    resource_type TEXT NOT NULL, -- 'search', 'gdpr_request', etc.
    resource_id UUID,
    
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Particionamiento por fecha (recomendado para produccion)
-- CREATE TABLE public.audit_logs ... PARTITION BY RANGE (created_at);

COMMENT ON TABLE public.audit_logs IS 'Log de auditoria para acciones sensibles';
```

---

## 3. Indices

```sql
-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan ON public.users(plan);

-- Searches
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_status ON public.searches(status);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);
CREATE INDEX idx_searches_expires_at ON public.searches(expires_at) 
    WHERE expires_at IS NOT NULL;

-- Search Results
CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_search_results_category ON public.search_results(category);
CREATE INDEX idx_search_results_severity ON public.search_results(severity);
CREATE INDEX idx_search_results_source ON public.search_results(source);
CREATE INDEX idx_search_results_not_dismissed ON public.search_results(search_id) 
    WHERE is_dismissed = FALSE;

-- GDPR Requests
CREATE INDEX idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_status ON public.gdpr_requests(status);
CREATE INDEX idx_gdpr_requests_next_reminder ON public.gdpr_requests(next_reminder_at) 
    WHERE next_reminder_at IS NOT NULL AND status NOT IN ('completed', 'rejected');
CREATE INDEX idx_gdpr_requests_search_result ON public.gdpr_requests(search_result_id) 
    WHERE search_result_id IS NOT NULL;

-- Request Templates
CREATE INDEX idx_request_templates_type_lang ON public.request_templates(type, language);
CREATE INDEX idx_request_templates_active ON public.request_templates(is_active) 
    WHERE is_active = TRUE;

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
```

---

## 4. Triggers y Funciones

### 4.1 Actualizacion automatica de updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_gdpr_requests_updated_at
    BEFORE UPDATE ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_request_templates_updated_at
    BEFORE UPDATE ON public.request_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.2 Crear perfil de usuario automaticamente

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, language)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'language',
            'es'
        )::user_language
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4.3 Actualizar contadores de busqueda

```sql
CREATE OR REPLACE FUNCTION update_search_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.searches
        SET total_results = total_results + 1,
            results_by_category = jsonb_set(
                COALESCE(results_by_category, '{}'::jsonb),
                ARRAY[NEW.category::text],
                (COALESCE((results_by_category->>NEW.category::text)::int, 0) + 1)::text::jsonb
            ),
            results_by_severity = jsonb_set(
                COALESCE(results_by_severity, '{}'::jsonb),
                ARRAY[NEW.severity::text],
                (COALESCE((results_by_severity->>NEW.severity::text)::int, 0) + 1)::text::jsonb
            )
        WHERE id = NEW.search_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_stats
    AFTER INSERT ON public.search_results
    FOR EACH ROW EXECUTE FUNCTION update_search_stats();
```

### 4.4 Marcar resultado con solicitud GDPR

```sql
CREATE OR REPLACE FUNCTION mark_result_has_gdpr()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.search_result_id IS NOT NULL THEN
        UPDATE public.search_results
        SET has_gdpr_request = TRUE
        WHERE id = NEW.search_result_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_result_has_gdpr
    AFTER INSERT ON public.gdpr_requests
    FOR EACH ROW EXECUTE FUNCTION mark_result_has_gdpr();
```

---

## 5. Row Level Security (RLS)

### 5.1 Habilitar RLS

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
```

### 5.2 Policies para users

```sql
-- Usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- No permitir INSERT directo (se hace via trigger)
-- No permitir DELETE directo (via Supabase Auth)
```

### 5.3 Policies para searches

```sql
-- Usuarios solo ven sus propias busquedas
CREATE POLICY "Users can view own searches"
    ON public.searches FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden crear busquedas para si mismos
CREATE POLICY "Users can create own searches"
    ON public.searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus busquedas (ej: cancelar)
CREATE POLICY "Users can update own searches"
    ON public.searches FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus busquedas
CREATE POLICY "Users can delete own searches"
    ON public.searches FOR DELETE
    USING (auth.uid() = user_id);
```

### 5.4 Policies para search_results

```sql
-- Usuarios ven resultados de sus propias busquedas
CREATE POLICY "Users can view own search results"
    ON public.search_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.searches
            WHERE searches.id = search_results.search_id
            AND searches.user_id = auth.uid()
        )
    );

-- Solo el sistema puede insertar resultados (service role)
CREATE POLICY "Service can insert results"
    ON public.search_results FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Usuarios pueden actualizar (dismiss) sus resultados
CREATE POLICY "Users can update own results"
    ON public.search_results FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.searches
            WHERE searches.id = search_results.search_id
            AND searches.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.searches
            WHERE searches.id = search_results.search_id
            AND searches.user_id = auth.uid()
        )
    );
```

### 5.5 Policies para gdpr_requests

```sql
-- Usuarios ven sus propias solicitudes
CREATE POLICY "Users can view own gdpr requests"
    ON public.gdpr_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden crear solicitudes
CREATE POLICY "Users can create gdpr requests"
    ON public.gdpr_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus solicitudes
CREATE POLICY "Users can update own gdpr requests"
    ON public.gdpr_requests FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar borradores
CREATE POLICY "Users can delete draft gdpr requests"
    ON public.gdpr_requests FOR DELETE
    USING (auth.uid() = user_id AND status = 'draft');
```

### 5.6 Policies para request_templates

```sql
-- Todos los usuarios autenticados pueden ver templates activos
CREATE POLICY "Authenticated users can view active templates"
    ON public.request_templates FOR SELECT
    USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Solo admins pueden modificar templates
CREATE POLICY "Only admins can manage templates"
    ON public.request_templates FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
```

### 5.7 Policies para audit_logs

```sql
-- Usuarios pueden ver sus propios logs
CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Solo el sistema puede insertar logs
CREATE POLICY "Service can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- Nadie puede modificar o eliminar logs
-- (No se crean policies para UPDATE o DELETE)
```

---

## 6. Datos Iniciales (Seed)

### 6.1 Templates GDPR en Espanol

```sql
-- Template: Derecho de supresion (Art. 17) - Espanol
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'erasure',
    'es',
    'Solicitud de supresion estandar',
    'Template general para solicitar eliminacion de datos personales',
    'Solicitud de supresion de datos personales - RGPD Art. 17',
    E'Estimado/a responsable de proteccion de datos,

Por medio de la presente, y en ejercicio del derecho de supresion reconocido en el articulo 17 del Reglamento General de Proteccion de Datos (RGPD), solicito la eliminacion de todos mis datos personales que obran en sus sistemas.

**Datos del solicitante:**
- Nombre completo: {{user_name}}
- Correo electronico: {{user_email}}
- Fecha de la solicitud: {{date}}

**Datos a eliminar:**
{{target_data_description}}

**Fundamento juridico:**
De conformidad con el articulo 17 del RGPD, tengo derecho a obtener la supresion de mis datos personales cuando:
- Los datos ya no son necesarios para los fines para los que fueron recogidos
- Retiro mi consentimiento y no existe otro fundamento juridico para el tratamiento
- Los datos han sido tratados ilicitamente

Le recuerdo que, segun el articulo 12.3 del RGPD, dispone de un plazo maximo de un mes para responder a esta solicitud.

En caso de no recibir respuesta satisfactoria, me reservo el derecho de presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD).

Atentamente,
{{user_name}}',
    'RGPD Articulo 17 - Derecho de supresion',
    TRUE
);

-- Template: Derecho de acceso (Art. 15) - Espanol
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'access',
    'es',
    'Solicitud de acceso estandar',
    'Template para solicitar acceso a datos personales',
    'Solicitud de acceso a datos personales - RGPD Art. 15',
    E'Estimado/a responsable de proteccion de datos,

En ejercicio del derecho de acceso reconocido en el articulo 15 del Reglamento General de Proteccion de Datos (RGPD), solicito que me proporcionen la siguiente informacion:

**Datos del solicitante:**
- Nombre completo: {{user_name}}
- Correo electronico: {{user_email}}
- Fecha de la solicitud: {{date}}

**Informacion solicitada:**
1. Confirmacion de si se estan tratando o no datos personales mios
2. En caso afirmativo:
   - Copia de todos mis datos personales
   - Fines del tratamiento
   - Categorias de datos tratados
   - Destinatarios a quienes se han comunicado los datos
   - Plazo de conservacion previsto
   - Origen de los datos (si no se obtuvieron de mi directamente)
   - Existencia de decisiones automatizadas, incluida la elaboracion de perfiles

Segun el articulo 12.3 del RGPD, disponen de un plazo maximo de un mes para responder.

Atentamente,
{{user_name}}',
    'RGPD Articulo 15 - Derecho de acceso',
    TRUE
);
```

### 6.2 Templates GDPR en Ingles

```sql
-- Template: Right to erasure (Art. 17) - English
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'erasure',
    'en',
    'Standard erasure request',
    'General template for requesting deletion of personal data',
    'Personal Data Erasure Request - GDPR Art. 17',
    E'Dear Data Protection Officer,

I am writing to exercise my right to erasure ("right to be forgotten") as provided by Article 17 of the General Data Protection Regulation (GDPR). I request the deletion of all my personal data held in your systems.

**Requestor information:**
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

**Data to be erased:**
{{target_data_description}}

**Legal basis:**
Under Article 17 of the GDPR, I have the right to obtain the erasure of my personal data when:
- The data is no longer necessary for the purposes for which it was collected
- I withdraw my consent and there is no other legal ground for the processing
- The data has been unlawfully processed

Please note that under Article 12(3) of the GDPR, you must respond to this request within one month.

If I do not receive a satisfactory response, I reserve the right to lodge a complaint with the relevant supervisory authority.

Yours faithfully,
{{user_name}}',
    'GDPR Article 17 - Right to erasure',
    TRUE
);

-- Template: Right of access (Art. 15) - English
INSERT INTO public.request_templates (
    type, language, name, description, subject, body, legal_basis, is_default
) VALUES (
    'access',
    'en',
    'Standard access request',
    'Template for requesting access to personal data',
    'Personal Data Access Request - GDPR Art. 15',
    E'Dear Data Protection Officer,

Under Article 15 of the General Data Protection Regulation (GDPR), I am exercising my right of access to request the following information:

**Requestor information:**
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

**Information requested:**
1. Confirmation of whether you are processing my personal data
2. If so, please provide:
   - A copy of all my personal data
   - The purposes of the processing
   - The categories of personal data concerned
   - The recipients to whom the data has been disclosed
   - The envisaged retention period
   - The source of the data (if not collected from me directly)
   - The existence of automated decision-making, including profiling

Under Article 12(3) of the GDPR, you must respond within one month.

Yours faithfully,
{{user_name}}',
    'GDPR Article 15 - Right of access',
    TRUE
);
```

---

## 7. Mantenimiento

### 7.1 Limpieza de datos expirados

```sql
-- Funcion para limpiar datos expirados (ejecutar via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Eliminar busquedas expiradas (y sus resultados via CASCADE)
    DELETE FROM public.searches
    WHERE expires_at < NOW();
    
    -- Eliminar PDFs expirados de storage (via Edge Function)
    -- Esta funcion solo marca, la eliminacion real es via API
    UPDATE public.gdpr_requests
    SET pdf_url = NULL
    WHERE pdf_expires_at < NOW() AND pdf_url IS NOT NULL;
    
    -- Eliminar logs de auditoria antiguos (>90 dias)
    DELETE FROM public.audit_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 7.2 Reset diario de contador de busquedas

```sql
-- Funcion para resetear contadores diarios
CREATE OR REPLACE FUNCTION reset_daily_search_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET searches_today = 0,
        searches_reset_at = NOW()
    WHERE searches_reset_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

*Schema generado para Huella Digital - 2026-02-04*
