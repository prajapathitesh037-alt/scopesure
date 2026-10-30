import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/schemas/api';
import { createProjectSchema } from '@/lib/schemas/project';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEMO_PROJECT } from '@/lib/demo-data';

const DEFAULT_REQUIREMENTS = [
  { field_key: 'solar_panels', label: 'Solar Panels', expected_value: 'Tier 1 Monocrystalline >= 400W', is_required: true },
  { field_key: 'inverter', label: 'Inverter System', expected_value: 'Microinverters or String with Optimizers', is_required: true },
  { field_key: 'mounting_structure', label: 'Mounting Structure', expected_value: 'PE-stamped rail racking', is_required: true },
  { field_key: 'installation_labor', label: 'Installation Labor', expected_value: 'Turnkey certified installation', is_required: true },
  { field_key: 'electrical_protection', label: 'Electrical Protection', expected_value: 'AC/DC disconnect + Panel upgrade if needed', is_required: true },
  { field_key: 'freight_delivery', label: 'Freight & Delivery', expected_value: 'Included to installation site', is_required: false },
  { field_key: 'workmanship_warranty', label: 'Workmanship Warranty', expected_value: '>= 10 years installer guarantee', is_required: true },
  { field_key: 'permits_interconnection', label: 'Permits & Interconnection', expected_value: 'Turnkey utility PTO & municipal filing', is_required: true },
];

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const admin = createAdminClient();

    let projects: any[] = [];

    if (user) {
      const { data, error } = await admin
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        projects = data;
      }
    }

    // Always include demo project for demonstration if not already in list
    if (!projects.some((p) => p.id === DEMO_PROJECT.id)) {
      projects.push({
        id: DEMO_PROJECT.id,
        name: DEMO_PROJECT.name,
        location: DEMO_PROJECT.location,
        system_capacity_kw: 10.4,
        system_type: DEMO_PROJECT.systemType,
        status: DEMO_PROJECT.status,
        created_at: DEMO_PROJECT.createdAt,
        updated_at: DEMO_PROJECT.createdAt,
        is_demo: true,
      });
    }

    return apiSuccess(projects);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to list projects', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid project details', 400, parsed.error.format());
    }

    const user = await getAuthenticatedUser();
    const admin = createAdminClient();

    const userId = user ? user.id : '00000000-0000-0000-0000-000000000001';

    const { data: newProject, error: projectError } = await admin
      .from('projects')
      .insert({
        user_id: userId,
        name: parsed.data.name,
        location: parsed.data.location,
        system_capacity_kw: parsed.data.system_capacity_kw,
        system_type: parsed.data.system_type,
        status: 'pending',
      })
      .select()
      .single();

    if (projectError || !newProject) {
      // In local demo without live Postgres, return synthetic created project
      const syntheticProject = {
        id: `proj-${Date.now()}`,
        user_id: userId,
        name: parsed.data.name,
        location: parsed.data.location,
        system_capacity_kw: parsed.data.system_capacity_kw,
        system_type: parsed.data.system_type,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return apiSuccess(syntheticProject, 'Project created successfully', 201);
    }

    // Insert baseline requirements for this new project
    const requirementsToInsert = DEFAULT_REQUIREMENTS.map((r) => ({
      project_id: newProject.id,
      field_key: r.field_key,
      label: r.label,
      expected_value: r.expected_value,
      is_required: r.is_required,
    }));

    await admin.from('project_requirements').insert(requirementsToInsert);

    return apiSuccess(newProject, 'Project created successfully', 201);
  } catch (error: any) {
    return apiError('INTERNAL_ERROR', error?.message || 'Failed to create project', 500);
  }
}
