-- ============================================
-- Huella Digital - Initial Database Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Custom Types
-- ============================================

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

-- ============================================
-- Tables
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
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

-- Searches table
CREATE TABLE public.searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    query_name TEXT NOT NULL,
    query_email TEXT,
    query_usernames TEXT[],
    status search_status DEFAULT 'pending',
    error_message TEXT,
    total_results INTEGER DEFAULT 0,
    results_by_category JSONB DEFAULT '{}',
    results_by_severity JSONB DEFAULT '{}',
    sources_queried TEXT[] DEFAULT '{}',
    sources_completed TEXT[] DEFAULT '{}',
    sources_failed TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    ip_address INET,
    user_agent TEXT
);

-- Search results table
CREATE TABLE public.search_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_id UUID NOT NULL REFERENCES public.searches(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    source_query TEXT,
    url TEXT,
    title TEXT,
    snippet TEXT,
    thumbnail_url TEXT,
    category result_category DEFAULT 'other',
    severity result_severity DEFAULT 'low',
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    breach_name TEXT,
    breach_date DATE,
    breach_data_classes TEXT[],
    metadata JSONB DEFAULT '{}',
    found_at TIMESTAMPTZ DEFAULT NOW(),
    is_dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    has_gdpr_request BOOLEAN DEFAULT FALSE
);

-- GDPR request templates
CREATE TABLE public.request_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type gdpr_request_type NOT NULL,
    language user_language NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    legal_basis TEXT NOT NULL,
    legal_notes TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GDPR requests table
CREATE TABLE public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    search_result_id UUID REFERENCES public.search_results(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.request_templates(id),
    request_type gdpr_request_type NOT NULL,
    target_entity TEXT NOT NULL,
    target_email TEXT,
    target_address TEXT,
    target_country TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    pdf_url TEXT,
    pdf_expires_at TIMESTAMPTZ,
    status gdpr_request_status DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    sent_method TEXT,
    acknowledged_at TIMESTAMPTZ,
    response_at TIMESTAMPTZ,
    response_summary TEXT,
    escalated_to TEXT,
    escalated_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    next_reminder_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_status ON public.searches(status);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);
CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_search_results_category ON public.search_results(category);
CREATE INDEX idx_search_results_severity ON public.search_results(severity);
CREATE INDEX idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_status ON public.gdpr_requests(status);

-- ============================================
-- Triggers
-- ============================================

-- Auto-update updated_at
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

-- Create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, language)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'language')::user_language, 'es')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment searches_today helper
CREATE OR REPLACE FUNCTION increment_searches_today(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET searches_today = CASE 
        WHEN searches_reset_at::date < CURRENT_DATE THEN 1
        ELSE searches_today + 1
    END,
    searches_reset_at = CASE
        WHEN searches_reset_at::date < CURRENT_DATE THEN NOW()
        ELSE searches_reset_at
    END
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_templates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Searches policies
CREATE POLICY "Users can view own searches"
    ON public.searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own searches"
    ON public.searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches"
    ON public.searches FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches"
    ON public.searches FOR DELETE
    USING (auth.uid() = user_id);

-- Search results policies
CREATE POLICY "Users can view own search results"
    ON public.search_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.searches
            WHERE searches.id = search_results.search_id
            AND searches.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own results"
    ON public.search_results FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.searches
            WHERE searches.id = search_results.search_id
            AND searches.user_id = auth.uid()
        )
    );

-- GDPR requests policies
CREATE POLICY "Users can view own gdpr requests"
    ON public.gdpr_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create gdpr requests"
    ON public.gdpr_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gdpr requests"
    ON public.gdpr_requests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete draft gdpr requests"
    ON public.gdpr_requests FOR DELETE
    USING (auth.uid() = user_id AND status = 'draft');

-- Templates policies (everyone can read active templates)
CREATE POLICY "Anyone can view active templates"
    ON public.request_templates FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- Seed Data: GDPR Templates
-- ============================================

INSERT INTO public.request_templates (type, language, name, description, subject, body, legal_basis, is_default) VALUES
-- Spanish erasure template
('erasure', 'es', 'Solicitud de supresion estandar', 
 'Template general para solicitar eliminacion de datos personales',
 'Solicitud de supresion de datos personales - RGPD Art. 17',
 'Estimado/a responsable de proteccion de datos,

Por medio de la presente, y en ejercicio del derecho de supresion reconocido en el articulo 17 del Reglamento General de Proteccion de Datos (RGPD), solicito la eliminacion de todos mis datos personales que obran en sus sistemas.

Datos del solicitante:
- Nombre completo: {{user_name}}
- Correo electronico: {{user_email}}
- Fecha de la solicitud: {{date}}

Datos a eliminar:
{{target_data_description}}

Fundamento juridico:
De conformidad con el articulo 17 del RGPD, tengo derecho a obtener la supresion de mis datos personales cuando:
- Los datos ya no son necesarios para los fines para los que fueron recogidos
- Retiro mi consentimiento y no existe otro fundamento juridico para el tratamiento
- Los datos han sido tratados ilicitamente

Le recuerdo que, segun el articulo 12.3 del RGPD, dispone de un plazo maximo de un mes para responder a esta solicitud.

En caso de no recibir respuesta satisfactoria, me reservo el derecho de presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD).

Atentamente,
{{user_name}}',
 'RGPD Articulo 17 - Derecho de supresion', TRUE),

-- Spanish access template  
('access', 'es', 'Solicitud de acceso estandar',
 'Template para solicitar acceso a datos personales',
 'Solicitud de acceso a datos personales - RGPD Art. 15',
 'Estimado/a responsable de proteccion de datos,

En ejercicio del derecho de acceso reconocido en el articulo 15 del Reglamento General de Proteccion de Datos (RGPD), solicito que me proporcionen la siguiente informacion:

Datos del solicitante:
- Nombre completo: {{user_name}}
- Correo electronico: {{user_email}}
- Fecha de la solicitud: {{date}}

Informacion solicitada:
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
 'RGPD Articulo 15 - Derecho de acceso', TRUE),

-- English erasure template
('erasure', 'en', 'Standard erasure request',
 'General template for requesting deletion of personal data',
 'Personal Data Erasure Request - GDPR Art. 17',
 'Dear Data Protection Officer,

I am writing to exercise my right to erasure ("right to be forgotten") as provided by Article 17 of the General Data Protection Regulation (GDPR). I request the deletion of all my personal data held in your systems.

Requestor information:
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

Data to be erased:
{{target_data_description}}

Legal basis:
Under Article 17 of the GDPR, I have the right to obtain the erasure of my personal data when:
- The data is no longer necessary for the purposes for which it was collected
- I withdraw my consent and there is no other legal ground for the processing
- The data has been unlawfully processed

Please note that under Article 12(3) of the GDPR, you must respond to this request within one month.

If I do not receive a satisfactory response, I reserve the right to lodge a complaint with the relevant supervisory authority.

Yours faithfully,
{{user_name}}',
 'GDPR Article 17 - Right to erasure', TRUE),

-- English access template
('access', 'en', 'Standard access request',
 'Template for requesting access to personal data',
 'Personal Data Access Request - GDPR Art. 15',
 'Dear Data Protection Officer,

Under Article 15 of the General Data Protection Regulation (GDPR), I am exercising my right of access to request the following information:

Requestor information:
- Full name: {{user_name}}
- Email address: {{user_email}}
- Date of request: {{date}}

Information requested:
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
 'GDPR Article 15 - Right of access', TRUE);
