import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_transactions,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions,
        AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as average_amount,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_volume
      FROM transactions
    `;

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
