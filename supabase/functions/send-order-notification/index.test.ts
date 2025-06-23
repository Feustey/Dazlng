import { assertEquals, assertMatch } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { stub } from "https://deno.land/std@0.168.0/testing/mock.ts";

// Mock des variables d'environnement
const env = {
  RESEND_API_KEY: 'test_resend_key',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_SERVICE_ROLE_KEY: 'test_service_role_key'
};

// Mock de l'ordre de test
const mockOrder = {
  order_id: 'test-123',
  amount: 100000,
  status: 'paid',
  customer_email: 'test@example.com',
  customer_name: 'Test User',
  product_name: 'DazNode',
  created_at: '2024-03-20T10:00:00Z'
};

// Mock de la réponse Resend
const mockResendResponse = {
  ok: true,
  json: () => Promise.resolve({ id: 'test-email-id' })
};

// Mock de la réponse Supabase
const mockSupabaseResponse = {
  error: null,
  data: { id: 1 }
};

Deno.test('send-order-notification - Succès', async () => {
  // Mock de fetch pour Resend
  const fetchStub = stub(globalThis, 'fetch', () => 
    Promise.resolve(mockResendResponse)
  );

  // Mock de Supabase
  const supabaseStub = stub(createClient, () => ({
    from: () => ({
      insert: () => Promise.resolve(mockSupabaseResponse)
    })
  }));

  // Simuler la requête
  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test_token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mockOrder)
  });

  // Exécuter la fonction
  const response = await handler(request);
  const data = await response.json();

  // Vérifications
  assertEquals(response.status, 200);
  assertEquals(data.success, true);

  // Vérifier l'appel à Resend
  assertEquals(fetchStub.calls.length, 1);
  const [resendUrl, resendOptions] = fetchStub.calls[0].args;
  assertEquals(resendUrl, 'https://api.resend.com/emails');
  assertEquals(resendOptions.method, 'POST');
  assertMatch(resendOptions.body, /test@example.com/);

  // Restaurer les stubs
  fetchStub.restore();
  supabaseStub.restore();
});

Deno.test('send-order-notification - Erreur d\'authentification', async () => {
  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mockOrder)
  });

  const response = await handler(request);
  assertEquals(response.status, 401);
  assertEquals(await response.text(), 'Unauthorized');
});

Deno.test('send-order-notification - Erreur Resend', async () => {
  // Mock de fetch pour simuler une erreur Resend
  const fetchStub = stub(globalThis, 'fetch', () => 
    Promise.resolve({
      ok: false,
      statusText: 'Service Unavailable'
    })
  );

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test_token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mockOrder)
  });

  const response = await handler(request);
  const data = await response.json();

  assertEquals(response.status, 500);
  assertEquals(data.error, 'Failed to send email: Service Unavailable');

  fetchStub.restore();
});

Deno.test('send-order-notification - Validation des données', async () => {
  const invalidOrder = {
    // Données manquantes
    order_id: 'test-123'
  };

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test_token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invalidOrder)
  });

  const response = await handler(request);
  const data = await response.json();

  assertEquals(response.status, 400);
  assertEquals(data.error, 'Invalid order data');
}); 