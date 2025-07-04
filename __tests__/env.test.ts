test('variables d'environnement chargées', () => {
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
}); 