process.env.RESEND_API_KEY = 'test_key';

import { POST } from '../../app/api/contact/route';

function mockRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('POST /api/contact', () => {
  it('retourne 400 si le body est vide', async () => {
    const req = mockRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400); // le handler renvoie 400 si champs manquants
  });

  it('retourne 200 si le body est correct', async () => {
    const req = mockRequest({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      companyName: 'TestCorp',
      jobTitle: 'Dev',
      companyPhone: '0123456789',
      companyWebsite: 'https://test.com',
      interest: 'Sujet',
      message: 'Message',
    });
    const res = await POST(req);
    expect([200, 202]).toContain(res.status);
  });
}); 