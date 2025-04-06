"use client";

import { sign, verify, JwtPayload } from "jsonwebtoken";
import { randomBytes } from "crypto";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getTokenExpirationDate(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
}

export async function signMessage(
  message: string,
  privateKey: string
): Promise<string> {
  return sign({ message }, privateKey, { algorithm: "RS256" });
}

export async function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const decoded = verify(signature, publicKey, { algorithms: ["RS256"] });
    return (decoded as any).message === message;
  } catch (error) {
    return false;
  }
}
