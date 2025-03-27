import { NextResponse } from 'next/server';

// Données historiques simulées
const historicalData = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  totalCapacity: Math.floor(Math.random() * 1000000) + 500000, // en sats
  activeChannels: Math.floor(Math.random() * 20) + 5,
  totalVolume: Math.floor(Math.random() * 2000000) + 1000000, // en sats
  totalFees: Math.floor(Math.random() * 10000) + 1000, // en sats
  totalPeers: Math.floor(Math.random() * 30) + 10,
}));

export async function GET() {
  try {
    return NextResponse.json(historicalData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données historiques' },
      { status: 500 }
    );
  }
} 