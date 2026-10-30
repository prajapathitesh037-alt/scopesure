import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(120),
  location: z.string().min(2, "Location is required").max(150),
  system_capacity_kw: z.number().positive("System capacity must be greater than 0"),
  system_type: z.string().min(2, "System type is required").max(100),
});

export const updateProjectSchema = createProjectSchema.partial();

export const requirementItemSchema = z.object({
  field_key: z.string().min(1, "field_key is required"),
  label: z.string().min(1, "label is required"),
  expected_value: z.string().nullable().optional(),
  is_required: z.boolean().default(true),
  notes: z.string().nullable().optional(),
});

export const updateRequirementsSchema = z.object({
  requirements: z.array(requirementItemSchema).min(1, "At least one requirement is needed"),
});

export const uploadUrlRequestSchema = z.object({
  vendor_name: z.string().min(1, "Vendor name is required"),
  filename: z.string().min(1, "Filename is required"),
  mime_type: z.enum(['application/pdf', 'text/plain'], {
    message: 'Only PDF and TXT documents are allowed',
  }),
  file_size_bytes: z.number().int().positive().max(10485760, "Maximum file size is 10MB"),
});

export const uploadCompleteSchema = z.object({
  quotation_id: z.string().uuid("Invalid quotation ID"),
  storage_path: z.string().min(1, "Storage path is required"),
});
