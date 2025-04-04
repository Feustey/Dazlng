"use server";

import { getHistoricalData } from "@/app/services/network.service";
import { NextResponse } from "next/server";
import { mockHistoricalData } from "../../../lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    const historicalData = await getHistoricalData();
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
