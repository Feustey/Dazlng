import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  try {
    // Vérifier l'authentification (simplifié pour l'instant)
    const sessionResult = { authenticated: false, user: null };
    
    if (sessionResult.authenticated && sessionResult.user) {
      const redirectUrl = `https://app.token-for-good.com/login?token=${sessionResult.user.id}`;
      return NextResponse.redirect(redirectUrl, { status: 302, headers: corsHeaders });
    }
    
    // Non authentifié : redirection simple
    return NextResponse.redirect("https://app.token-for-good.com/login", { status: 302, headers: corsHeaders });
  } catch (error) {
    console.error("Erreur lors de la redirection:", error);
    return NextResponse.redirect("https://app.token-for-good.com/login", { status: 302, headers: corsHeaders });
  }
}

export const dynamic = "force-dynamic"; 