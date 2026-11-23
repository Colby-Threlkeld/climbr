// Public Supabase config. Both values end up in the app bundle and are safe to ship:
// RLS is what protects the data (privacy-safety.md, Secrets). Never put the service-role
// or secret key here.
//
// Expo only inlines `process.env.EXPO_PUBLIC_*` when accessed with this exact dotted
// syntax, so don't refactor these into a loop or `process.env[name]`.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
      'Copy .env.example to .env, fill both in, and restart `npx expo start`.',
  );
}

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;
