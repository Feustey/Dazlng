import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('Parcours inscription - Créer son compte', () => {
  const email = `testuser+${Date.now()}@daznode.com`;
  const prenom = 'Test';
  const nom = 'User';
  let otpCode: string;
  let tempToken: string;

  it('envoie un code OTP à un nouvel email', async () => {
    const res = await fetch(`${BASE_URL}/api/otp/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: `${prenom} ${nom}` }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('récupère le code OTP (mock)', async () => {
    const res = await fetch(`${BASE_URL}/api/test/last-otp?email=${encodeURIComponent(email)}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    otpCode = data.code;
    expect(otpCode).toHaveLength(6);
  });

  it('vérifie le code OTP', async () => {
    const res = await fetch(`${BASE_URL}/api/otp/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: otpCode, name: `${prenom} ${nom}` }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.needsRegistration).toBe(true);
    expect(data.tempToken).toBeDefined();
    tempToken = data.tempToken;
  });

  it('crée le compte utilisateur', async () => {
    const res = await fetch(`${BASE_URL}/api/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, prenom, nom, tempToken }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe(email);
    expect(data.user.isNewUser).toBe(true);
  });
}); 