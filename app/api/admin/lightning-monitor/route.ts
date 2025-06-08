import { NextRequest, NextResponse } from 'next/server';
import { lightningMonitor } from '@/app/lib/lightning-monitor';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider');
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        if (provider) {
          // Statut d'un provider spécifique
          const currentStatus = lightningMonitor.getCurrentStatus();
          const providerStatus = currentStatus.get(provider);
          
          if (!providerStatus) {
            return NextResponse.json({ 
              error: 'Provider not found',
              availableProviders: Array.from(currentStatus.keys())
            }, { status: 404 });
          }

          const metrics = lightningMonitor.getProviderMetrics(provider);
          
          return NextResponse.json({
            provider,
            status: providerStatus,
            metrics
          });
        } else {
          // Statut de tous les providers
          const currentStatus = lightningMonitor.getCurrentStatus();
          const statusMap: Record<string, any> = {};
          
                    for (const [name, status] of currentStatus) {
            statusMap[name] = {
              ...status,
              metrics: lightningMonitor.getProviderMetrics(name)
            };
          }

          return NextResponse.json({
            providers: statusMap,
            overall: lightningMonitor.getOverallStats(),
            bestProvider: lightningMonitor.getBestProvider()
          });
        }

      case 'health':
        // Forcer une vérification de santé
        const healthResults = await lightningMonitor.checkAllProviders();
        return NextResponse.json({
          message: 'Health check completed',
          results: healthResults,
          timestamp: new Date().toISOString()
        });

      case 'metrics':
        if (!provider) {
          return NextResponse.json({ 
            error: 'Provider parameter required for metrics' 
          }, { status: 400 });
        }

        const providerMetrics = lightningMonitor.getProviderMetrics(provider);
        if (!providerMetrics) {
          return NextResponse.json({ 
            error: 'No metrics found for provider' 
          }, { status: 404 });
        }

        return NextResponse.json({
          provider,
          metrics: providerMetrics
        });

      case 'stats':
        const overallStats = lightningMonitor.getOverallStats();
        const providersStatus = lightningMonitor.getCurrentStatus();
        
        return NextResponse.json({
          overall: overallStats,
          providers: Object.fromEntries(
            Array.from(providersStatus.entries()).map(([name, status]) => [
              name,
              {
                status,
                metrics: lightningMonitor.getProviderMetrics(name)
              }
            ])
          ),
          lastUpdated: new Date().toISOString()
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['status', 'health', 'metrics', 'stats']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Lightning Monitor API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { action, provider, data } = await req.json();

    switch (action) {
      case 'simulate_payment':
        // Simuler un paiement pour tester le monitoring
        if (!provider || !data?.amount) {
          return NextResponse.json({ 
            error: 'Provider and amount required' 
          }, { status: 400 });
        }

        const invoiceId = `test_${Date.now()}`;
        const duration = Math.random() * 5000 + 1000; // 1-6 secondes
        const success = Math.random() > 0.2; // 80% de succès

        await lightningMonitor.logInvoiceMetrics(
          invoiceId,
          provider,
          data.amount,
          duration,
          success,
          success ? undefined : 'Simulated error for testing'
        );

        return NextResponse.json({
          message: 'Payment simulation completed',
          invoiceId,
          provider,
          amount: data.amount,
          duration,
          success
        });

      case 'force_health_check':
        const results = await lightningMonitor.checkAllProviders();
        return NextResponse.json({
          message: 'Forced health check completed',
          results,
          timestamp: new Date().toISOString()
        });

      case 'reset_metrics':
        if (!provider) {
          return NextResponse.json({ 
            error: 'Provider parameter required' 
          }, { status: 400 });
        }

        // Note: Cette fonctionnalité nécessiterait d'ajouter une méthode reset au monitor
        return NextResponse.json({
          message: 'Reset metrics not implemented yet',
          provider
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['simulate_payment', 'force_health_check', 'reset_metrics']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Lightning Monitor API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Endpoint de documentation
export async function OPTIONS(_req: NextRequest): Promise<Response> {
  return NextResponse.json({
    endpoints: {
      GET: {
        description: "Get Lightning provider status and metrics",
        parameters: {
          action: "status | health | metrics | stats (default: status)",
          provider: "Specific provider name (optional for some actions)"
        },
        examples: [
          "/api/admin/lightning-monitor?action=status",
          "/api/admin/lightning-monitor?action=health",
          "/api/admin/lightning-monitor?action=metrics&provider=lnbits",
          "/api/admin/lightning-monitor?action=stats"
        ]
      },
      POST: {
        description: "Perform monitoring actions",
        actions: [
          {
            action: "simulate_payment",
            body: { provider: "string", data: { amount: "number" } }
          },
          {
            action: "force_health_check",
            body: {}
          },
          {
            action: "reset_metrics",
            body: { provider: "string" }
          }
        ]
      }
    },
    monitoring: {
      description: "Real-time monitoring of Lightning Network providers",
      features: [
        "Health checking every 30 seconds",
        "Invoice generation metrics",
        "Automatic alerting on failures",
        "Provider performance comparison",
        "Uptime tracking"
      ]
    }
  });
} 