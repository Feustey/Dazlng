"use server";

import { NextResponse } from "next/server";
import { prismaService } from "@/app/services/prismaService";

export async function GET() {
  try {
    const nodes = await prismaService.getNodes();
    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}
