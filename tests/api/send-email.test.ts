process.env.RESEND_API_KEY = 'test_key';

jest.mock('resend', () => ({
  Resend: function () { return { emails: { send: async () => ({}) } } }
}));

import { POST } from '../../app/api/send-email/route';

function mockRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('POST /api/send-email', () => {
  it('retourne 400 si le body est incomplet', async () => {
    const req = mockRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('retourne 200 si le body est complet', async () => {
    const req = mockRequest({
      to: 'test@test.com',
      subject: 'Sujet',
      html: '<b>Test</b>',
    });
    const res = await POST(req);
    expect([200, 201]).toContain(res.status);
  });
}); 