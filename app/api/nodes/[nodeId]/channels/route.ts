import { NextResponse } from "next/server";
import { prismaService } from "@/app/services/prismaService";

export async function GET(
  request: Request,
  { params }: { params: { nodeId: string } }
) {
  try {
    const channels = await prismaService.getNodeChannels(params.nodeId);
    return NextResponse.json(channels);
  } catch (error) {
    console.error("Error fetching node channels:", error);
    return NextResponse.json(
      { error: "Failed to fetch node channels" },
      { status: 500 }
    );
  }
}
