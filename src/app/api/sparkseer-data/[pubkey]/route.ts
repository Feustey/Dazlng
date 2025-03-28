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
          alias: data.node_stats.alias,
          total_capacity: data.node_stats.total_capacity,
          active_channels: data.node_stats.active_channels,
          // ... autres champs à mettre à jour
          updatedAt: new Date()
        },
        create: {
          pubkey: params.pubkey,
          alias: data.node_stats.alias,
          total_capacity: data.node_stats.total_capacity,
          active_channels: data.node_stats.active_channels,
          // ... autres champs à créer
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