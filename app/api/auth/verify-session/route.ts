import { NextRequest, NextResponse } from 'next/server';
import { CrossDomainSessionService } from '../../../../lib/services/cross-domain-session';

export async function GET(req: NextRequest) {
  const corsHeaders = CrossDomainSessionService.getCorsHeaders();
  // Vérification session via cookie
  const sessionResult = await CrossDomainSessionService.verifySession();
  if (sessionResult.authenticated && sessionResult.user) {
    return NextResponse.json({
      authenticated: true,
      user: sessionResult.user
    }, { status: 200, headers: corsHeaders });
  }
  // Redirection si non authentifié
  return NextResponse.redirect('https://app.token-for-good.com/login', { status: 302, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const corsHeaders = CrossDomainSessionService.getCorsHeaders();
  const authHeader = req.headers.get('authorization') || '';
  const sessionResult = await CrossDomainSessionService.verifyBearerToken(authHeader);
  if (sessionResult.authenticated && sessionResult.user) {
    return NextResponse.json({
      authenticated: true,
      user: sessionResult.user
    }, { status: 200, headers: corsHeaders });
  }
  // Redirection si non authentifié
  return NextResponse.redirect('https://app.token-for-good.com/login', { status: 302, headers: corsHeaders });
}

export async function OPTIONS() {
  const corsHeaders = CrossDomainSessionService.getCorsHeaders();
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export const dynamic = "force-dynamic";