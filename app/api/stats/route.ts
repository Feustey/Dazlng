import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { dynamic, runtime, errorResponse, successResponse } from "../config";

export { dynamic, runtime };

export async function GET() {
  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_nodes,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_nodes,
        AVG(capacity) as avg_capacity
      FROM nodes
    `;

    return successResponse(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return errorResponse("Failed to fetch stats");
  }
}
