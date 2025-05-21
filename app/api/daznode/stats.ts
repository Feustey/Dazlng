import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url!);
  const nodeId = searchParams.get('node_id');
  if (!nodeId) {
    return NextResponse.json({ error: 'node_id requis' }, { status: 400 });
  }
  const baseUrl = process.env.DAZNODE_API_URL;
  try {
    const [summary, centralities, stats, history] = await Promise.all([
      fetch(`${baseUrl}/network/summary`).then(res => res.json()),
      fetch(`${baseUrl}/network/centralities`).then(res => res.json()),
      fetch(`${baseUrl}/network/node/${nodeId}/stats`).then(res => res.json()),
      fetch(`${baseUrl}/network/node/${nodeId}/history`).then(res => res.json()),
    ]);
    return NextResponse.json({ summary, centralities, stats, history });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des données DazNode' }, { status: 500 });
  }
} 