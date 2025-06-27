import { NextRequest, NextResponse } from 'next/server';
import { CrossDomainSessionService } from '../../../../lib/services/cross-domain-session';

export async function GET(req: NextRequest) {
  const corsHeaders = CrossDomainSessionService.getCorsHeaders();
  const sessionResult = await CrossDomainSessionService.verifySession();

  if (sessionResult.authenticated && sessionResult.user) {
    const redirectUrl = CrossDomainSessionService.createTokenForGoodRedirect(sessionResult.user);
    return NextResponse.redirect(redirectUrl, { status: 302, headers: corsHeaders });
  }
  // Non authentifié : redirection simple
  return NextResponse.redirect('https://app.token-for-good.com/login', { status: 302, headers: corsHeaders });
}

export async function OPTIONS() {
  const corsHeaders = CrossDomainSessionService.getCorsHeaders();
  return new NextResponse(null, { status: 200, headers: corsHeaders });
} 