"use client";

import { JwtPayload, verify } from "jsonwebtoken";

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
