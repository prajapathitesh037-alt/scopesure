import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEMO_PROJECT } from '@/lib/demo-data';

export interface AuthUser {
  id: string;
  email?: string;
  isDemo?: boolean;
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      isDemo: false,
    };
  } catch (err) {
    return null;
  }
}

export async function requireAuthUser(allowDemoProject = false, projectId?: string): Promise<AuthUser> {
  const user = await getAuthenticatedUser();

  if (user) {
    return user;
  }

  // If demo project is requested and allowed for preview
  if (allowDemoProject && (projectId === DEMO_PROJECT.id || projectId === 'demo' || !projectId)) {
    return {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'demo@scopesure.local',
      isDemo: true,
    };
  }

  throw new Error('UNAUTHORIZED');
}
