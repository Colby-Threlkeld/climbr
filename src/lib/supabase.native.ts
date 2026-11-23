// iOS/Android have no browser localStorage. This import installs one backed by
// expo-sqlite so the session survives app restarts (Expo's Supabase guide, SDK 58).
// It's native-only because expo-sqlite on web needs extra WASM setup we don't want.
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

import { supabasePublishableKey, supabaseUrl } from './supabase-env';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
