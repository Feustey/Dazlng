import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MCP_API_URL = 'https://mcp-c544a464bb52.herokuapp.com';

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const response = await fetch(`${MCP_API_URL}/sparkseer-data/${params.pubkey}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données Sparkseer');
    }

    const data = await response.json();
    
    // Sauvegarder les données dans la base de données locale si nécessaire
    if (data.node_stats) {
      await prisma.node.upsert({
        where: { pubkey: params.pubkey },
        update: {
          alias: data.node_stats.alias || '',
          platform: data.node_stats.platform || '',
          version: data.node_stats.version || '',
          total_fees: data.node_stats.total_fees || 0,
          avg_fee_rate_ppm: data.node_stats.avg_fee_rate_ppm || 0,
          total_capacity: data.node_stats.total_capacity || 0,
          active_channels: data.node_stats.active_channels || 0,
          total_volume: data.node_stats.total_volume || 0,
          total_peers: data.node_stats.total_peers || 0,
          uptime: data.node_stats.uptime || 0,
          opened_channel_count: data.node_stats.opened_channel_count || 0,
          color: data.node_stats.color || '#000000',
          address: data.node_stats.address || '',
          closed_channel_count: data.node_stats.closed_channel_count || 0,
          pending_channel_count: data.node_stats.pending_channel_count || 0,
          avg_capacity: data.node_stats.avg_capacity || 0,
          avg_fee_rate: data.node_stats.avg_fee_rate || 0,
          avg_base_fee_rate: data.node_stats.avg_base_fee_rate || 0,
          betweenness_rank: data.node_stats.betweenness_rank || 0,
          eigenvector_rank: data.node_stats.eigenvector_rank || 0,
          closeness_rank: data.node_stats.closeness_rank || 0,
          weighted_betweenness_rank: data.node_stats.weighted_betweenness_rank || 0,
          weighted_closeness_rank: data.node_stats.weighted_closeness_rank || 0,
          weighted_eigenvector_rank: data.node_stats.weighted_eigenvector_rank || 0,
          updatedAt: new Date()
        },
        create: {
          pubkey: params.pubkey,
          alias: data.node_stats.alias || '',
          platform: data.node_stats.platform || '',
          version: data.node_stats.version || '',
          total_fees: data.node_stats.total_fees || 0,
          avg_fee_rate_ppm: data.node_stats.avg_fee_rate_ppm || 0,
          total_capacity: data.node_stats.total_capacity || 0,
          active_channels: data.node_stats.active_channels || 0,
          total_volume: data.node_stats.total_volume || 0,
          total_peers: data.node_stats.total_peers || 0,
          uptime: data.node_stats.uptime || 0,
          opened_channel_count: data.node_stats.opened_channel_count || 0,
          color: data.node_stats.color || '#000000',
          address: data.node_stats.address || '',
          closed_channel_count: data.node_stats.closed_channel_count || 0,
          pending_channel_count: data.node_stats.pending_channel_count || 0,
          avg_capacity: data.node_stats.avg_capacity || 0,
          avg_fee_rate: data.node_stats.avg_fee_rate || 0,
          avg_base_fee_rate: data.node_stats.avg_base_fee_rate || 0,
          betweenness_rank: data.node_stats.betweenness_rank || 0,
          eigenvector_rank: data.node_stats.eigenvector_rank || 0,
          closeness_rank: data.node_stats.closeness_rank || 0,
          weighted_betweenness_rank: data.node_stats.weighted_betweenness_rank || 0,
          weighted_closeness_rank: data.node_stats.weighted_closeness_rank || 0,
          weighted_eigenvector_rank: data.node_stats.weighted_eigenvector_rank || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données Sparkseer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données Sparkseer' },
      { status: 500 }
    );
  }
} 