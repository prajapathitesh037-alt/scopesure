import { z } from 'zod';

const envSchema = z.object({
  NEBIUS_API_KEY: z.string().min(1, "NEBIUS_API_KEY is missing").optional(),
  NEBIUS_BASE_URL: z.string().url().default("https://api.tokenfactory.nebius.com/v1/"),
  NEBIUS_MODEL: z.string().default("nvidia/nemotron-4-340b-instruct"),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),

  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse({
    NEBIUS_API_KEY: process.env.NEBIUS_API_KEY,
    NEBIUS_BASE_URL: process.env.NEBIUS_BASE_URL || "https://api.tokenfactory.nebius.com/v1/",
    NEBIUS_MODEL: process.env.NEBIUS_MODEL || "nvidia/nemotron-4-340b-instruct",

    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  });

  if (!result.success) {
    const missingKeys = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
    console.error(`[Server Config Warning] Invalid environment configuration: ${missingKeys}`);
    // Return with defaults rather than throwing unhandled fatal crash in client components
    cachedEnv = {
      NEBIUS_API_KEY: process.env.NEBIUS_API_KEY,
      NEBIUS_BASE_URL: "https://api.tokenfactory.nebius.com/v1/",
      NEBIUS_MODEL: "nvidia/nemotron-4-340b-instruct",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    };
    return cachedEnv;
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function validateRequiredServerEnv(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!process.env.NEBIUS_API_KEY) missing.push('NEBIUS_API_KEY');
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SECRET_KEY');

  return {
    isValid: missing.length === 0,
    missing,
  };
}
