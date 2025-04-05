"use client";

import { JwtPayload, verify } from "jsonwebtoken";
import { randomBytes } from "crypto";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export function generateToken(email: string): string {
  return randomBytes(32).toString("hex");
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getSessionExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
}
