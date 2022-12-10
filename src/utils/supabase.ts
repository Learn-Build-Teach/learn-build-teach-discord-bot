import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_PROJECT_URL) {
  throw new Error('Supabase Project URL must be included');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase Project URL must be included');
}

export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
