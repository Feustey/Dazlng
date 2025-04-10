// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

const {
  handlers: { GET, POST },
} = NextAuth(authOptions);

export { GET, POST };
