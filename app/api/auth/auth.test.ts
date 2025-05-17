import { generateKeyPairSync } from "crypto";

import { createJWT, verifyJWT } from "@app/lib/jwt";
import { hashPassword, comparePasswords } from "@app/lib/password";

import { signMessage, verifySignature } from "@app/lib/auth";

describe("Authentication Tests", () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  describe("Signatures", () => {
    it("devrait signer un message correctement", async () => {
      const message = "Test message";
      const signature = await signMessage(message, privateKey);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe("string");
    });

    it("devrait vérifier une signature valide", async () => {
      const message = "Test message";
      const signature = await signMessage(message, privateKey);
      const isValid = await verifySignature(message, signature, publicKey);
      expect(isValid).toBe(true);
    });
  });

  describe("JWT", () => {
    it("devrait créer un JWT valide", async () => {
      const payload = { userId: "123", role: "user" };
      const token = await createJWT(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("devrait vérifier un JWT valide", async () => {
      const payload = { userId: "123", role: "user" };
      const token = await createJWT(payload);
      const decoded = await verifyJWT(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe("Passwords", () => {
    it("devrait hasher un mot de passe", async () => {
      const password = "testPassword123";
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it("devrait comparer correctement les mots de passe", async () => {
      const password = "testPassword123";
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePasswords(password, hashedPassword);
      expect(isValid).toBe(true);
    });
  });
});
