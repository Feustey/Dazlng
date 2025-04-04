import { NextResponse } from "next/server";

// Configuration pour forcer le rendu dynamique
export const dynamic = "force-dynamic";
export const runtime = "edge";

// Headers CORS
export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Réponses d'erreur standardisées
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: corsHeaders(),
    }
  );
}

// Réponses de succès standardisées
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(),
  });
}
