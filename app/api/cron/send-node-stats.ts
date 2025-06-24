import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { generateEmailTemplate } from '../../../utils/email';

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

// Définition du type pour les données du nœud
export interface DazNodeData {
  summary: unknown;
  centralities: unknown;
  stats: unknown;
  history: unknown;
}

async function fetchDazNodeData(nodeId: string): Promise<DazNodeData> {
  const baseUrl = process.env.DAZNODE_API_URL ?? "";
  const [summary, centralities, stats, history] = await Promise.all([
    fetch(`${baseUrl}/network/summary`).then(res => res.json()),
    fetch(`${baseUrl}/network/centralities`).then(res => res.json()),
    fetch(`${baseUrl}/network/node/${nodeId}/stats`).then(res => res.json()),
    fetch(`${baseUrl}/network/node/${nodeId}/history`).then(res => res.json()),
  ]);
  return { summary, centralities, stats, history };
}

function generateEmailContent(data: DazNodeData, username: string): string {
  return generateEmailTemplate({
    title: 'Rapport Hebdomadaire de votre Nœud Lightning',
    username,
    mainContent: 'Voici les statistiques de votre nœud pour cette semaine :',
    detailedContent: `<h3>Résumé du Réseau</h3><pre>${JSON.stringify(data.summary, null, 2)}</pre><h3>Centralités</h3><pre>${JSON.stringify(data.centralities, null, 2)}</pre><h3>Statistiques de votre Nœud</h3><pre>${JSON.stringify(data.stats, null, 2)}</pre><h3>Historique</h3><pre>${JSON.stringify(data.history, null, 2)}</pre>`,
    ctaText: 'Optimiser mon nœud',
    ctaLink: 'https://dazno.de/network/node'
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? ""}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  
  const supabase = getSupabaseAdminClient();
  
  // Récupérer tous les utilisateurs avec un node_id
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, node_id')
    .not('node_id', 'is', null);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  for (const user of users) {
    if (!user.node_id) continue;
    const nodeData = await fetchDazNodeData(user.node_id);
    const emailContent = generateEmailContent(nodeData, user.email);
    await resend.emails.send({
      from: 'contact@dazno.de',
      to: user.email,
      subject: 'Rapport Hebdomadaire de votre Nœud Lightning',
      html: emailContent,
    });
  }
  return NextResponse.json({ success: true });
}
