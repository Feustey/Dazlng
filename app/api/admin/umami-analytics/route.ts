import { NextRequest, NextResponse } from 'next/server';

export interface _UmamiStats {
  pageviews: { value: number };
  visitors: { value: number };
  visits: { value: number };
  bounces: { value: number };
  totaltime: { value: number };
}

export interface _UmamiPageViews {
  pageviews: Array<{
    x: string; // URL
    y: number; // views
  }>;
}

export interface _UmamiMetrics {
  browsers: Array<{ x: string; y: number }>;
  os: Array<{ x: string; y: number }>;
  devices: Array<{ x: string; y: number }>;
  countries: Array<{ x: string; y: number }>;
}

export interface _UmamiEvent {
  x: string; // event name
  y: number; // count
}

// Mode développement avec données mock
const generateMockAnalytics = () => {
  const today = new Date();
  const _lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return {
    stats: {
      pageviews: { value: 2547 },
      visitors: { value: 1832 },
      visits: { value: 2156 },
      bounces: { value: 412 },
      totaltime: { value: 185430 } // en secondes
    },
    pageviews: {
      pageviews: [
        { x: '/', y: 856 },
        { x: '/daznode', y: 423 },
        { x: '/user/node', y: 318 },
        { x: '/admin/dashboard', y: 124 },
        { x: '/dazpay', y: 98 },
        { x: '/dazbox', y: 87 },
        { x: '/auth', y: 234 },
        { x: '/user/dazia', y: 156 },
        { x: '/admin/users', y: 89 },
        { x: '/contact', y: 67 }
      ]
    },
    metrics: {
      browsers: [
        { x: 'Chrome', y: 1245 },
        { x: 'Safari', y: 432 },
        { x: 'Firefox', y: 298 },
        { x: 'Edge', y: 156 },
        { x: 'Other', y: 89 }
      ],
      os: [
        { x: 'macOS', y: 856 },
        { x: 'Windows', y: 723 },
        { x: 'Linux', y: 298 },
        { x: 'iOS', y: 234 },
        { x: 'Android', y: 145 }
      ],
      devices: [
        { x: 'Desktop', y: 1877 },
        { x: 'Mobile', y: 456 },
        { x: 'Tablet', y: 123 }
      ],
      countries: [
        { x: 'France', y: 1245 },
        { x: 'Canada', y: 298 },
        { x: 'Germany', y: 234 },
        { x: 'USA', y: 189 },
        { x: 'Switzerland', y: 145 },
        { x: 'Other', y: 345 }
      ]
    },
    events: [
      { x: 'node_connection', y: 89 },
      { x: 'premium_upgrade', y: 23 },
      { x: 'export_data', y: 67 },
      { x: 'contact_form', y: 34 },
      { x: 'newsletter_signup', y: 156 }
    ],
    realtime: {
      timestamp: new Date().toISOString(),
      active_visitors: 12,
      active_sessions: 8,
      current_pageviews: 23
    }
  };
};

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const startAt = searchParams.get('startAt') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime().toString();
    const endAt = searchParams.get('endAt') || new Date().getTime().toString();
    const unit = searchParams.get('unit') || 'day';
    
    // Mode développement - données mock
    const isDevelopment = !(process.env.NODE_ENV ?? "") || (process.env.NODE_ENV ?? "") !== 'production';
    
    if (isDevelopment || !(process.env.UMAMI_API_URL ?? "") || !(process.env.UMAMI_API_KEY ?? "")) {
      console.log('[UMAMI-ANALYTICS] Mode développement ou configuration manquante - données mock utilisées');
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json({
        success: true,
        data: generateMockAnalytics(),
        source: 'mock',
        timestamp: new Date().toISOString()
      });
    }

    // Mode production - API Umami réelle
    const websiteId = process.env.UMAMI_WEBSITE_ID ?? "";
    const apiUrl = process.env.UMAMI_API_URL ?? "";
    const apiKey = process.env.UMAMI_API_KEY ?? "";

    if (!websiteId || !apiUrl || !apiKey) {
      throw new Error('Configuration Umami manquante');
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const baseParams = `?startAt=${startAt}&endAt=${endAt}&unit=${unit}`;

    // Paralléliser les appels API
    const [statsRes, pageviewsRes, metricsRes, eventsRes] = await Promise.allSettled([
      // Stats globales
      fetch(`${apiUrl}/websites/${websiteId}/stats${baseParams}`, { headers }),
      
      // Pages vues
      fetch(`${apiUrl}/websites/${websiteId}/pageviews${baseParams}`, { headers }),
      
      // Métriques (browsers, OS, etc.)
      fetch(`${apiUrl}/websites/${websiteId}/metrics${baseParams}&type=url`, { headers }),
      
      // Événements
      fetch(`${apiUrl}/websites/${websiteId}/events${baseParams}`, { headers })
    ]);

    // Traiter les réponses
    const results = await Promise.allSettled([
      statsRes.status === 'fulfilled' ? statsRes.value.json() : null,
      pageviewsRes.status === 'fulfilled' ? pageviewsRes.value.json() : null,
      metricsRes.status === 'fulfilled' ? metricsRes.value.json() : null,
      eventsRes.status === 'fulfilled' ? eventsRes.value.json() : null
    ]);

    const [stats, pageviews, metrics, events] = results.map(r => 
      r.status === 'fulfilled' ? r.value : null
    );
    // Stats en temps réel
    const realtimeRes = await fetch(`${apiUrl}/websites/${websiteId}/active`, { headers });
    const realtime = realtimeRes.ok ? await realtimeRes.json() : null;

    const analyticsData = {
      stats: stats || { pageviews: { value: 0 }, visitors: { value: 0 }, visits: { value: 0 }, bounces: { value: 0 }, totaltime: { value: 0 } },
      pageviews: pageviews || { pageviews: [] },
      metrics: {
        browsers: metrics?.browsers || [],
        os: metrics?.os || [],
        devices: metrics?.devices || [],
        countries: metrics?.countries || []
      },
      events: events?.events || [],
      realtime: realtime || { active_visitors: 0, active_sessions: 0, current_pageviews: 0 }
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
      source: 'umami',
      timestamp: new Date().toISOString(),
      period: { startAt, endAt, unit }
    });

  } catch (error) {
    console.error('[UMAMI-ANALYTICS] Erreur:', error);
    
    // Fallback vers données mock en cas d'erreur
    console.log('[UMAMI-ANALYTICS] Erreur API, fallback vers données mock');
    return NextResponse.json({
      success: true,
      data: generateMockAnalytics(),
      source: 'mock_fallback',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erreur API Umami'
    });
  }
}

// POST pour déclencher des événements personnalisés
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { event, data } = await req.json();

    if (!event) {
      return NextResponse.json({ error: 'Nom d\'événement requis' }, { status: 400 });
    }

    // Mode développement
    const isDevelopment = !(process.env.NODE_ENV ?? "") || (process.env.NODE_ENV ?? "") !== 'production';
    
    if (isDevelopment) {
      console.log('[UMAMI-ANALYTICS] Événement simulé:', { event, data });
      return NextResponse.json({
        success: true,
        message: 'Événement simulé en mode développement',
        event,
        data
      });
    }

    // Mode production - envoyer à Umami
    const websiteId = process.env.UMAMI_WEBSITE_ID ?? "";
    const apiUrl = process.env.UMAMI_API_URL ?? "";
    const apiKey = process.env.UMAMI_API_KEY ?? "";

    if (!websiteId || !apiUrl || !apiKey) {
      throw new Error('Configuration Umami manquante');
    }

    const response = await fetch(`${apiUrl}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: websiteId,
          name: event,
          data: data || {}
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Umami: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Événement envoyé à Umami',
      event,
      data
    });

  } catch (error) {
    console.error('[UMAMI-ANALYTICS] Erreur POST:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
