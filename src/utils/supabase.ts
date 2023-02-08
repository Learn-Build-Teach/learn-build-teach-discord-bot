import { createClient } from '@supabase/supabase-js';
import { variables } from '../variables';

export const supabase = createClient(
  variables.SUPABASE_PROJECT_URL,
  variables.SUPABASE_SERVICE_ROLE_KEY
);
