import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function getSession(request: NextRequest) {
  try {
    // Utiliser un timeout pour éviter les blocages
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout getting session")), 3000);
    });

    const tokenPromise = getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    // Utiliser Promise.race pour éviter que la fonction ne bloque trop longtemps
    const token = await Promise.race([tokenPromise, timeoutPromise]);

    if (!token) {
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error checking session:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return session;
}
