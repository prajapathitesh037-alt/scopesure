-- SCOPEsure: Solar Quotation Comparison & Audit Schema
-- Migration: 20261030000000_create_scopesure_schema.sql

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLE: projects
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    system_capacity_kw NUMERIC NOT NULL CHECK (system_capacity_kw > 0),
    system_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- ============================================================================
-- 2. TABLE: project_requirements
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    field_key TEXT NOT NULL,
    label TEXT NOT NULL,
    expected_value TEXT,
    is_required BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_project_field_key UNIQUE(project_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_project_requirements_project_id ON public.project_requirements(project_id);

-- ============================================================================
-- 3. TABLE: quotations
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760), -- max 10MB
    currency TEXT NOT NULL DEFAULT 'USD',
    quoted_total_minor BIGINT NULL,
    upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'failed')),
    extraction_status TEXT NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'extracted', 'needs_ocr', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotations_project_id ON public.quotations(project_id);

-- ============================================================================
-- 4. TABLE: quotation_pages
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quotation_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL CHECK (page_number > 0),
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_quotation_page UNIQUE(quotation_id, page_number)
);

CREATE INDEX IF NOT EXISTS idx_quotation_pages_quotation_id ON public.quotation_pages(quotation_id);

-- ============================================================================
-- 5. TABLE: analysis_runs
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analysis_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    model_id TEXT NOT NULL,
    prompt_version TEXT NOT NULL DEFAULT 'v1.0',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ NULL,
    error_code TEXT NULL,
    error_message TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_analysis_runs_project_id ON public.analysis_runs(project_id);

-- ============================================================================
-- 6. TABLE: extracted_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.extracted_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_run_id UUID NOT NULL REFERENCES public.analysis_runs(id) ON DELETE CASCADE,
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    requirement_key TEXT NOT NULL,
    raw_label TEXT NOT NULL,
    extracted_value TEXT,
    extracted_status TEXT NOT NULL CHECK (extracted_status IN ('included', 'excluded', 'not_specified', 'unclear', 'conflicting')),
    source_page INTEGER NULL,
    source_excerpt TEXT,
    evidence_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_extracted_items_run ON public.extracted_items(analysis_run_id);
CREATE INDEX IF NOT EXISTS idx_extracted_items_quote ON public.extracted_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_extracted_items_req_key ON public.extracted_items(requirement_key);

-- ============================================================================
-- 7. TABLE: findings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_run_id UUID NOT NULL REFERENCES public.analysis_runs(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    quotation_id UUID NULL REFERENCES public.quotations(id) ON DELETE SET NULL,
    finding_type TEXT NOT NULL CHECK (finding_type IN (
        'missing_information',
        'explicit_exclusion',
        'conflicting_terms',
        'ambiguous_term',
        'cost_issue',
        'specification_difference'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source_excerpt TEXT NULL,
    source_page INTEGER NULL,
    evidence_verified BOOLEAN NOT NULL DEFAULT false,
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_findings_project_id ON public.findings(project_id);
CREATE INDEX IF NOT EXISTS idx_findings_run_id ON public.findings(analysis_run_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON public.findings(severity);

-- ============================================================================
-- 8. TABLE: clarification_drafts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clarification_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID NOT NULL REFERENCES public.findings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message_body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'sent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clarifications_finding_id ON public.clarification_drafts(finding_id);

-- ============================================================================
-- 9. TABLE: reports
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    analysis_run_id UUID NOT NULL REFERENCES public.analysis_runs(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_project_id ON public.reports(project_id);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clarification_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper policy function: check if project belongs to current authenticated user
-- Projects Policy
CREATE POLICY "Users can view own projects or demo project"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id OR id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Users can insert own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- Project Requirements Policy
CREATE POLICY "Users can access requirements of accessible projects"
    ON public.project_requirements FOR ALL
    USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid() OR id = '00000000-0000-0000-0000-000000000001'));

-- Quotations Policy
CREATE POLICY "Users can access quotations of accessible projects"
    ON public.quotations FOR ALL
    USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid() OR id = '00000000-0000-0000-0000-000000000001'));

-- Quotation Pages Policy
CREATE POLICY "Users can access quotation pages of accessible quotations"
    ON public.quotation_pages FOR ALL
    USING (quotation_id IN (
        SELECT q.id FROM public.quotations q
        JOIN public.projects p ON q.project_id = p.id
        WHERE p.user_id = auth.uid() OR p.id = '00000000-0000-0000-0000-000000000001'
    ));

-- Analysis Runs Policy
CREATE POLICY "Users can access analysis runs of accessible projects"
    ON public.analysis_runs FOR ALL
    USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid() OR id = '00000000-0000-0000-0000-000000000001'));

-- Extracted Items Policy
CREATE POLICY "Users can access extracted items of accessible analysis runs"
    ON public.extracted_items FOR ALL
    USING (analysis_run_id IN (
        SELECT a.id FROM public.analysis_runs a
        JOIN public.projects p ON a.project_id = p.id
        WHERE p.user_id = auth.uid() OR p.id = '00000000-0000-0000-0000-000000000001'
    ));

-- Findings Policy
CREATE POLICY "Users can access findings of accessible projects"
    ON public.findings FOR ALL
    USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid() OR id = '00000000-0000-0000-0000-000000000001'));

-- Clarification Drafts Policy
CREATE POLICY "Users can access own clarification drafts"
    ON public.clarification_drafts FOR ALL
    USING (user_id = auth.uid() OR user_id IS NULL);

-- Reports Policy
CREATE POLICY "Users can access reports of accessible projects"
    ON public.reports FOR ALL
    USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid() OR id = '00000000-0000-0000-0000-000000000001'));

-- ============================================================================
-- 11. STORAGE BUCKET CREATION (quotation-documents)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'quotation-documents',
    'quotation-documents',
    false,
    10485760, -- 10MB
    ARRAY['application/pdf', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf', 'text/plain'];

-- Storage RLS policy for quotation-documents
CREATE POLICY "Users can upload quotation files to their own project folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'quotation-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view quotation files in their own project folder"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'quotation-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete quotation files in their own project folder"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'quotation-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

