import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export const runtime = "nodejs";

interface Stats {
  total_nodes: number;
  total_channels: number;
  total_capacity: number;
  avg_channel_size: number;
  median_fee_rate: number;
}

export async function GET() {
  try {
    const stats = await prisma.$queryRaw<Stats[]>`
      SELECT 
        COUNT(DISTINCT pubkey) as total_nodes,
        SUM(active_channels) as total_channels,
        SUM(total_capacity) as total_capacity,
        AVG(avg_capacity) as avg_channel_size,
        AVG(avg_fee_rate) as median_fee_rate
      FROM "Node"
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `;

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        total_nodes: 0,
        total_channels: 0,
        total_capacity: 0,
        avg_channel_size: 0,
        median_fee_rate: 0,
      },
      { status: 500 }
    );
  }
}
