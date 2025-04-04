import { NextResponse } from "next/server";
import { getNetworkStats } from "@/app/services/network.service";

export async function GET() {
  try {
    const stats = await getNetworkStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching network stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch network stats" },
      { status: 500 }
    );
  }
}
