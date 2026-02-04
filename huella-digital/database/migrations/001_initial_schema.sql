-- Huella Digital - Initial Database Schema
-- Version: 1.0
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. CUSTOM TYPES (ENUMS)
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
-- 3. TABLES
-- ============================================

-- Users (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    encrypted_email TEXT,
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

COMMENT ON TABLE public.users IS 'Extended user profiles';
COMMENT ON COLUMN public.users.encrypted_email IS 'Encrypted email for self-search verification';
COMMENT ON COLUMN public.users.searches_today IS 'Daily search counter';

-- Searches
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

COMMENT ON TABLE public.searches IS 'Digital footprint searches';
COMMENT ON COLUMN public.searches.expires_at IS 'Expiration date for automatic cleanup';

-- Search Results
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

COMMENT ON TABLE public.search_results IS 'Individual search results';
COMMENT ON COLUMN public.search_results.confidence_score IS 'Probability match (0-1)';

-- Request Templates
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

COMMENT ON TABLE public.request_templates IS 'Predefined GDPR request templates';
COMMENT ON COLUMN public.request_templates.body IS 'Body with placeholders: {{user_name}}, {{user_email}}, {{target_entity}}, {{date}}';

-- GDPR Requests
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

COMMENT ON TABLE public.gdpr_requests IS 'GDPR requests and their tracking';
COMMENT ON COLUMN public.gdpr_requests.next_reminder_at IS 'Next automatic reminder date';

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Audit log for sensitive actions';

-- ============================================
-- 4. INDEXES
-- ============================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan ON public.users(plan);

CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_status ON public.searches(status);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);
CREATE INDEX idx_searches_expires_at ON public.searches(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_search_results_category ON public.search_results(category);
CREATE INDEX idx_search_results_severity ON public.search_results(severity);
CREATE INDEX idx_search_results_source ON public.search_results(source);
CREATE INDEX idx_search_results_not_dismissed ON public.search_results(search_id) WHERE is_dismissed = FALSE;

CREATE INDEX idx_gdpr_requests_user_id ON public.gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_status ON public.gdpr_requests(status);
CREATE INDEX idx_gdpr_requests_next_reminder ON public.gdpr_requests(next_reminder_at) 
    WHERE next_reminder_at IS NOT NULL AND status NOT IN ('completed', 'rejected');
CREATE INDEX idx_gdpr_requests_search_result ON public.gdpr_requests(search_result_id) 
    WHERE search_result_id IS NOT NULL;

CREATE INDEX idx_request_templates_type_lang ON public.request_templates(type, language);
CREATE INDEX idx_request_templates_active ON public.request_templates(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================
-- 5. TRIGGERS & FUNCTIONS
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

CREATE TRIGGER trigger_request_templates_updated_at
    BEFORE UPDATE ON public.request_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, language)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
        COALESCE(
            (NEW.raw_user_meta_data->>'language')::user_language,
            'es'
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update search stats on new result
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

-- Mark result as having GDPR request
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

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

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
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Service can insert results"
    ON public.search_results FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

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
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete draft gdpr requests"
    ON public.gdpr_requests FOR DELETE
    USING (auth.uid() = user_id AND status = 'draft');

-- Templates policies
CREATE POLICY "Authenticated users can view active templates"
    ON public.request_templates FOR SELECT
    USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Audit logs policies
CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
