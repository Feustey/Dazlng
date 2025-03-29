import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function GET() {
  try {
    // Récupérer les données historiques via l'API MCP
    const historicalData = await mcpService.getHistoricalData();

    // Formater les données pour correspondre à l'interface HistoricalData
    const formattedData = historicalData.map(record => ({
      timestamp: record.timestamp,
      total_fees: record.total_fees,
      total_capacity: record.total_capacity,
      active_channels: record.active_channels,
      total_peers: record.total_peers,
      total_volume: record.total_volume
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error);
    
    // Déterminer le statut HTTP en fonction du type d'erreur
    let statusCode = 500;
    let errorMessage = 'Erreur lors de la récupération des données historiques';
    
    if (error instanceof Error) {
      // Vérifier si c'est une erreur de service indisponible
      if (error.message.includes('503') || error.message.includes('indisponible')) {
        statusCode = 503;
        errorMessage = 'Le service externe est temporairement indisponible. Veuillez réessayer plus tard.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 