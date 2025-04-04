import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import secp256k1 from "secp256k1";
import { createHash } from "crypto";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function POST(request: Request) {
  try {
    const { signature, message, pubkey } = await request.json();

    // Vérification de la signature
    const messageHash = createHash("sha256").update(message).digest();
    const signatureBuffer = Buffer.from(signature, "hex");
    const pubkeyBuffer = Buffer.from(pubkey, "hex");

    const isValid = secp256k1.ecdsaVerify(
      signatureBuffer,
      messageHash,
      pubkeyBuffer
    );

    if (!isValid) {
      return errorResponse("Invalid signature", 401);
    }

    // Création du token JWT
    const token = sign(
      { pubkey },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Stockage du token dans un cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return successResponse({ message: "Authentication successful" });
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse("Authentication failed");
  }
}
