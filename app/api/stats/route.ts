import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectToDatabase } from "../../lib/db";
import { SessionModel } from "../../lib/models";
// ... existing code ...

// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

export const dynamic = "force-dynamic";
