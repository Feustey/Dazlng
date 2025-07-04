import { z } from 'zod';

// Test du schéma de validation OTP
const SendCodeSchema = z.object({
  email: z.string().email()
});

describe('Validation OTP - Tests unitaires', () => {
  it('valide un email correct', () => {
    const validEmail = 'test@example.com';
    const result = SendCodeSchema.safeParse({ email: validEmail });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe(validEmail);
    }
  });

  it('rejette un email invalide', () => {
    const invalidEmail = 'invalid-email';
    const result = SendCodeSchema.safeParse({ email: invalidEmail });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].code).toBe('invalid_string');
    }
  });

  it('rejette un email vide', () => {
    const emptyEmail = '';
    const result = SendCodeSchema.safeParse({ email: emptyEmail });
    expect(result.success).toBe(false);
  });

  it('rejette un email sans @', () => {
    const noAtEmail = 'testexample.com';
    const result = SendCodeSchema.safeParse({ email: noAtEmail });
    expect(result.success).toBe(false);
  });

  it('rejette un email sans domaine', () => {
    const noDomainEmail = 'test@';
    const result = SendCodeSchema.safeParse({ email: noDomainEmail });
    expect(result.success).toBe(false);
  });
});

// Tests d'intégration désactivés - nécessitent un environnement de test Supabase
describe('Parcours inscription - Tests d\'intégration (désactivés)', () => {
  it.skip('envoie un code OTP à un nouvel email (nécessite environnement de test)', async () => {
    // Test désactivé - nécessite configuration Supabase de test
  });

  it.skip('vérifie le code OTP (nécessite environnement de test)', async () => {
    // Test désactivé - nécessite configuration Supabase de test
  });

  it.skip('crée le compte utilisateur (nécessite environnement de test)', async () => {
    // Test désactivé - nécessite configuration Supabase de test
  });
}); 