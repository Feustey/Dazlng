import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import secp256k1 from "secp256k1";
import { createHash } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { message, signature, pubkey } = await request.json();

    // Vérifier que le message commence par notre préfixe
    if (!message.startsWith("lnplus-login-")) {
      return NextResponse.json({ error: "invalidMessage" }, { status: 400 });
    }

    try {
      // Convertir le message en hash SHA256
      const messageHash = createHash("sha256")
        .update(Buffer.from(message))
        .digest();

      // Convertir la signature et la clé publique en Buffer
      const signatureBuffer = Buffer.from(signature, "hex");
      const pubkeyBuffer = Buffer.from(pubkey, "hex");

      // Vérifier que la clé publique est valide
      if (!secp256k1.publicKeyVerify(pubkeyBuffer)) {
        return NextResponse.json({ error: "invalidPubkey" }, { status: 400 });
      }

      // Vérifier la signature
      const isValid = secp256k1.ecdsaVerify(
        signatureBuffer,
        messageHash,
        pubkeyBuffer
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "invalidSignature" },
          { status: 400 }
        );
      }

      // Créer un JWT avec la clé publique comme identifiant
      const token = sign(
        {
          pubkey,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 jours
        },
        JWT_SECRET
      );

      // Définir le cookie
      cookies().set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
      });

      return NextResponse.json({ success: true });
    } catch (signatureError) {
      console.error("Error verifying signature:", signatureError);
      return NextResponse.json({ error: "invalidFormat" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "unknown" }, { status: 500 });
  }
}
