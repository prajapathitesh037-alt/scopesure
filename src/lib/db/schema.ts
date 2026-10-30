export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type UploadStatus = 'pending' | 'uploaded' | 'failed';
export type ExtractionStatus = 'pending' | 'extracted' | 'needs_ocr' | 'failed';
export type FindingStatus = 'included' | 'excluded' | 'not_specified' | 'unclear' | 'conflicting';
export type FindingSeverity = 'low' | 'medium' | 'high';
export type FindingType =
  | 'missing_information'
  | 'explicit_exclusion'
  | 'conflicting_terms'
  | 'ambiguous_term'
  | 'cost_issue'
  | 'specification_difference';

export interface DbProject {
  id: string;
  user_id: string | null;
  name: string;
  location: string;
  system_capacity_kw: number;
  system_type: string;
  status: AnalysisStatus;
  created_at: string;
  updated_at: string;
}

export interface DbProjectRequirement {
  id: string;
  project_id: string;
  field_key: string;
  label: string;
  expected_value: string | null;
  is_required: boolean;
  notes: string | null;
  created_at: string;
}

export interface DbQuotation {
  id: string;
  project_id: string;
  vendor_name: string;
  original_filename: string;
  storage_path: string;
  mime_type: string;
  file_size_bytes: number;
  currency: string;
  quoted_total_minor: number | null;
  upload_status: UploadStatus;
  extraction_status: ExtractionStatus;
  created_at: string;
}

export interface DbQuotationPage {
  id: string;
  quotation_id: string;
  page_number: number;
  extracted_text: string;
  created_at: string;
}

export interface DbAnalysisRun {
  id: string;
  project_id: string;
  status: AnalysisStatus;
  model_id: string;
  prompt_version: string;
  started_at: string;
  completed_at: string | null;
  error_code: string | null;
  error_message: string | null;
}

export interface DbExtractedItem {
  id: string;
  analysis_run_id: string;
  quotation_id: string;
  requirement_key: string;
  raw_label: string;
  extracted_value: string | null;
  extracted_status: FindingStatus;
  source_page: number | null;
  source_excerpt: string | null;
  evidence_verified: boolean;
  created_at: string;
}

export interface DbFinding {
  id: string;
  analysis_run_id: string;
  project_id: string;
  quotation_id: string | null;
  finding_type: FindingType;
  severity: FindingSeverity;
  status: 'open' | 'reviewed' | 'resolved';
  title: string;
  description: string;
  source_excerpt: string | null;
  source_page: number | null;
  evidence_verified: boolean;
  recommended_action: string;
  created_at: string;
}

export interface DbClarificationDraft {
  id: string;
  finding_id: string;
  user_id: string | null;
  subject: string;
  message_body: string;
  status: 'draft' | 'reviewed' | 'sent';
  created_at: string;
}

export interface DbReport {
  id: string;
  project_id: string;
  analysis_run_id: string;
  report_data: any;
  created_at: string;
}
