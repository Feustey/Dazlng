import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MCP_API_URL = 'https://mcp-c544a464bb52.herokuapp.com';

// Validation de la clé publique
function isValidPubkey(pubkey: string): boolean {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

// Transformation des données pour assurer la cohérence des types
function transformNodeStats(data: any) {
  return {
    alias: String(data.alias || ''),
    platform: String(data.platform || ''),
    version: String(data.version || ''),
    total_fees: Number(data.total_fees || 0),
    avg_fee_rate_ppm: Number(data.avg_fee_rate_ppm || 0),
    total_capacity: Number(data.total_capacity || 0),
    active_channels: Number(data.active_channels || 0),
    total_volume: Number(data.total_volume || 0),
    total_peers: Number(data.total_peers || 0),
    uptime: Number(data.uptime || 0),
    opened_channel_count: Number(data.opened_channel_count || 0),
    color: String(data.color || '#000000'),
    address: String(data.address || ''),
    closed_channel_count: Number(data.closed_channel_count || 0),
    pending_channel_count: Number(data.pending_channel_count || 0),
    avg_capacity: Number(data.avg_capacity || 0),
    avg_fee_rate: Number(data.avg_fee_rate || 0),
    avg_base_fee_rate: Number(data.avg_base_fee_rate || 0),
    betweenness_rank: Number(data.betweenness_rank || 0),
    eigenvector_rank: Number(data.eigenvector_rank || 0),
    closeness_rank: Number(data.closeness_rank || 0),
    weighted_betweenness_rank: Number(data.weighted_betweenness_rank || 0),
    weighted_closeness_rank: Number(data.weighted_closeness_rank || 0),
    weighted_eigenvector_rank: Number(data.weighted_eigenvector_rank || 0),
  };
}

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    // Validation de la clé publique
    if (!isValidPubkey(params.pubkey)) {
      return NextResponse.json(
        { error: 'Clé publique invalide' },
        { status: 400 }
      );
    }

    const response = await fetch(`${MCP_API_URL}/sparkseer-data/${params.pubkey}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.node_stats) {
      return NextResponse.json(
        { error: 'Données invalides reçues de l\'API' },
        { status: 422 }
      );
    }

    // Transformation et validation des données
    const transformedStats = transformNodeStats(data.node_stats);
    
    // Sauvegarder les données dans la base de données locale
    await prisma.node.upsert({
      where: { pubkey: params.pubkey },
      update: {
        ...transformedStats,
        updatedAt: new Date()
      },
      create: {
        pubkey: params.pubkey,
        ...transformedStats,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données Sparkseer:', error);
    
    // Gestion spécifique des erreurs
    if (error instanceof Error) {
      if (error.message.includes('HTTP')) {
        return NextResponse.json(
          { error: 'Erreur de communication avec l\'API Sparkseer' },
          { status: 503 }
        );
      }
      if (error.message.includes('Prisma')) {
        return NextResponse.json(
          { error: 'Erreur de base de données' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    // Fermer la connexion Prisma
    await prisma.$disconnect();
  }
} 