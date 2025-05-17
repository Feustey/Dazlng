import { createHmac } from "crypto";

// import { prisma } from "@lib/prisma"; // TODO: Créer le module lib/prisma ou corriger l'import
import { NextRequest } from "next/server";

import { POST } from "@/app/api/authentication/alby/webhook/route";

// Mock de prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      upsert: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  },
}));

describe("Alby Webhook Tests", () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock des variables d'environnement
  const originalEnv = process.env;
  beforeAll(() => {
    process.env = {
      ...originalEnv,
      ALBY_WEBHOOK_SECRET: "test_webhook_secret",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("devrait rejeter une requête sans signature", async () => {
    // Créer une requête sans en-tête de signature
    const request = new NextRequest(
      "http://localhost:3000/api/authentication/alby/webhook",
      {
        method: "POST",
        body: JSON.stringify({
          type: "sign_message",
          pubkey: "test_pubkey",
          message: "test_message",
        }),
      }
    );

    // Appeler la fonction de route
    const response = await POST(request);
    const data = await response.json();

    // Vérifier la réponse
    expect(response.status).toBe(401);
    expect(data.error).toBe("Signature manquante");
  });

  it("devrait rejeter une requête avec une signature invalide", async () => {
    // Créer une requête avec une signature invalide
    const request = new NextRequest(
      "http://localhost:3000/api/authentication/alby/webhook",
      {
        method: "POST",
        headers: {
          "x-alby-signature": "invalid_signature",
        },
        body: JSON.stringify({
          type: "sign_message",
          pubkey: "test_pubkey",
          message: "test_message",
        }),
      }
    );

    // Appeler la fonction de route
    const response = await POST(request);
    const data = await response.json();

    // Vérifier la réponse
    expect(response.status).toBe(401);
    expect(data.error).toBe("Signature invalide");
  });

  it("devrait rejeter un type d'événement non supporté", async () => {
    // Créer une signature valide
    const payload = JSON.stringify({
      type: "unsupported_event",
      pubkey: "test_pubkey",
      message: "test_message",
    });
    const signature = createHmac("sha256", "test_webhook_secret")
      .update(payload)
      .digest("hex");

    // Créer une requête avec une signature valide mais un type d'événement non supporté
    const request = new NextRequest(
      "http://localhost:3000/api/authentication/alby/webhook",
      {
        method: "POST",
        headers: {
          "x-alby-signature": signature,
        },
        body: payload,
      }
    );

    // Appeler la fonction de route
    const response = await POST(request);
    const data = await response.json();

    // Vérifier la réponse
    expect(response.status).toBe(400);
    expect(data.error).toBe("Type d'événement non supporté");
  });

  it("devrait rejeter un message invalide", async () => {
    // Créer une signature valide
    const payload = JSON.stringify({
      type: "sign_message",
      pubkey: "test_pubkey",
      message: "Message invalide",
      signature: "test_signature",
    });
    const signature = createHmac("sha256", "test_webhook_secret")
      .update(payload)
      .digest("hex");

    // Créer une requête avec une signature valide mais un message invalide
    const request = new NextRequest(
      "http://localhost:3000/api/authentication/alby/webhook",
      {
        method: "POST",
        headers: {
          "x-alby-signature": signature,
        },
        body: payload,
      }
    );

    // Appeler la fonction de route
    const response = await POST(request);
    const data = await response.json();

    // Vérifier la réponse
    expect(response.status).toBe(400);
    expect(data.error).toBe("Message invalide");
  });

  it("devrait traiter correctement un message de signature valide", async () => {
    // Configurer les mocks
    const mockUser = {
      id: "user_id",
      pubkey: "test_pubkey",
      name: "Test User",
      email: "test@example.com",
    };
    const mockSession = {
      id: "session_id",
      userId: "user_id",
      expiresAt: new Date(),
    };

    (prisma.user.upsert as jest.Mock).mockResolvedValue(mockUser);
    (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);

    // Créer une signature valide
    const payload = JSON.stringify({
      type: "sign_message",
      pubkey: "test_pubkey",
      message: "Connexion à Daznode - 2023-01-01T00:00:00.000Z",
      signature: "test_signature",
    });
    const signature = createHmac("sha256", "test_webhook_secret")
      .update(payload)
      .digest("hex");

    // Créer une requête avec une signature valide et un message valide
    const request = new NextRequest(
      "http://localhost:3000/api/authentication/alby/webhook",
      {
        method: "POST",
        headers: {
          "x-alby-signature": signature,
        },
        body: payload,
      }
    );

    // Appeler la fonction de route
    const response = await POST(request);
    const data = await response.json();

    // Vérifier la réponse
    expect(response.status).toBe(200);
    expect(data.token).toBe("session_id");
    expect(data.user).toEqual({
      id: "user_id",
      pubkey: "test_pubkey",
      name: "Test User",
      email: "test@example.com",
    });

    // Vérifier que les fonctions de prisma ont été appelées correctement
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { pubkey: "test_pubkey" },
      update: {
        lastLoginAt: expect.any(Date),
      },
      create: {
        pubkey: "test_pubkey",
        name: expect.any(String),
        email: expect.any(String),
      },
    });

    expect(prisma.session.create).toHaveBeenCalledWith({
      data: {
        userId: "user_id",
        expiresAt: expect.any(Date),
      },
    });
  });
});
