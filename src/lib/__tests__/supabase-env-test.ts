// A missing .env should fail loudly with a fix-it message, not as a vague supabase-js error.
describe('supabase-env', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
    // The module reads env vars once at import, so each test needs a fresh copy.
    jest.resetModules();
  });

  it('throws a helpful error when the vars are missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    expect(() => jest.requireActual('../supabase-env')).toThrow(/Copy \.env\.example to \.env/);
  });

  it('exports the values when both are set', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
    const env = jest.requireActual<typeof import('../supabase-env')>('../supabase-env');
    expect(env.supabaseUrl).toBe('https://example.supabase.co');
    expect(env.supabasePublishableKey).toBe('sb_publishable_test');
  });
});
