// Web + fallback. Native builds pick up supabase.native.ts instead via Metro's platform
// extensions. On web, supabase-js persists the session in the browser's localStorage.
import { createClient } from '@supabase/supabase-js';

import { supabasePublishableKey, supabaseUrl } from './supabase-env';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Sign-in is an email code (step 08), not a magic link, so there's never a session in the URL.
    detectSessionInUrl: false,
  },
});
