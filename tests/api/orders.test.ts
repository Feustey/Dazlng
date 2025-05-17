process.env.RESEND_API_KEY = 'test_key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => ({ data: { id: 1 }, error: null }) }) })
    })
  }
}));
jest.mock('resend', () => ({
  Resend: function () { return { emails: { send: async () => ({}) } } }
}));

import { POST } from '../../app/api/orders/route';

function mockRequest(body: any) {
  return {
    json: async () => body,
    headers: new Map(),
  } as any;
}

describe('POST /api/orders', () => {
  it('retourne 400 si le body est incomplet', async () => {
    const req = mockRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('retourne 200 si le body est complet', async () => {
    const req = mockRequest({
      customer: {
        email: 'test@test.com',
        fullName: 'Test User',
        address: '1 rue de la paix',
        city: 'Paris',
        postalCode: '75000',
        country: 'France',
        phone: '0123456789',
      },
      product: {
        name: 'Produit',
        quantity: 1,
        priceEur: 10,
        priceSats: 1000,
      },
      total: 1000,
      status: 'pending',
    });
    const res = await POST(req);
    expect([200, 201]).toContain(res.status);
  });
}); 