import { NextRequest, NextResponse } from 'next/server';
import { EmailMarketingService } from '@/lib/email/resend-service';

const emailService = new EmailMarketingService();

// POST /api/email/campaigns/[id]/send - Envoie une campagne
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const campaignId = resolvedParams.id;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'ID de campagne requis' } },
        { status: 400 }
);
    }

    // Envoie la campagne
    const result = await emailService.sendCampaign(campaignId);

    return NextResponse.json({
      success: true,
      data: {
        campaign_id: campaignId,
        results: result
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la campagne:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        } 
      },
      { status: 500 }
);
  }
}

// POST /api/email/campaigns/[id]/test - Envoie un email de test
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const campaignId = resolvedParams.id;
    const { testEmail } = await request.json();

    if (!campaignId || !testEmail) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'ID de campagne et email de test requis' } },
        { status: 400 }
);
    }

    // Valide l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Format d\'email invalide' } },
        { status: 400 }
);
    }

    // Envoie l'email de test
    await emailService.sendTestEmail(campaignId, testEmail);

    return NextResponse.json({
      success: true,
      data: {
        campaign_id: campaignId,
        test_email: testEmail,
        message: 'Email de test envoyé avec succès'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        } 
      },
      { status: 500 }
);
  }
}
