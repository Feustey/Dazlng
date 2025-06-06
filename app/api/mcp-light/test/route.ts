import { NextRequest, NextResponse } from 'next/server';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test de l\'API MCP-Light...');

    // Initialiser l'API
    const initialized = await mcpLightAPI.initialize();
    if (!initialized) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INITIALIZATION_FAILED',
          message: 'Échec de l\'initialisation de l\'API MCP-Light'
        }
      }, { status: 500 });
    }

    // Vérifier l'état de santé
    const healthStatus = await mcpLightAPI.checkHealth();

    // Tester avec un nœud exemple si fourni via query params
    const pubkey = request.nextUrl.searchParams.get('pubkey');
    let nodeAnalysis = null;

    if (pubkey && mcpLightAPI.isValidPubkey(pubkey)) {
      try {
        console.log(`🔍 Test d'analyse pour le nœud: ${pubkey.substring(0, 10)}...`);
        nodeAnalysis = await mcpLightAPI.analyzeNode(
          pubkey,
          'Test d\'intégration API',
          ['increase_revenue', 'improve_centrality']
        );
      } catch (error) {
        console.error('Erreur lors de l\'analyse du nœud:', error);
        nodeAnalysis = { error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    }

    const testResults = {
      api_status: {
        initialized: mcpLightAPI.isInitialized(),
        credentials: mcpLightAPI.getCredentials() ? 'Present' : 'Missing',
        health: healthStatus
      },
      test_info: {
        pubkey_provided: !!pubkey,
        pubkey_valid: pubkey ? mcpLightAPI.isValidPubkey(pubkey) : null,
        analysis_attempted: !!nodeAnalysis
      },
      node_analysis: nodeAnalysis,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Test MCP-Light API terminé avec succès');

    return NextResponse.json({
      success: true,
      data: testResults,
      meta: {
        message: 'Test MCP-Light API réussi',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors du test MCP-Light API:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'TEST_FAILED',
        message: error instanceof Error ? error.message : 'Erreur inconnue lors du test'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pubkey, context, goals } = body;

    if (!pubkey) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_PUBKEY',
          message: 'La clé publique du nœud est requise'
        }
      }, { status: 400 });
    }

    if (!mcpLightAPI.isValidPubkey(pubkey)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Format de clé publique invalide (doit faire 66 caractères hexadécimaux)'
        }
      }, { status: 400 });
    }

    // Initialiser l'API si nécessaire
    if (!mcpLightAPI.isInitialized()) {
      const initialized = await mcpLightAPI.initialize();
      if (!initialized) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'INITIALIZATION_FAILED',
            message: 'Échec de l\'initialisation de l\'API MCP-Light'
          }
        }, { status: 500 });
      }
    }

    // Effectuer l'analyse complète
    const analysis = await mcpLightAPI.analyzeNode(
      pubkey,
      context || 'Analyse via API REST',
      goals || ['increase_revenue', 'improve_centrality']
    );

    return NextResponse.json({
      success: true,
      data: analysis,
      meta: {
        message: 'Analyse du nœud réussie',
        node_id: pubkey.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse du nœud:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'ANALYSIS_FAILED',
        message: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'analyse'
      }
    }, { status: 500 });
  }
} 