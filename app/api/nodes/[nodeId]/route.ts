import { NextResponse } from "next/server";
import { prismaService } from "@/app/services/prismaService";

export async function GET(
  request: Request,
  { params }: { params: { nodeId: string } }
) {
  try {
    const node = await prismaService.getNodeDetails(params.nodeId);
    return NextResponse.json(node);
  } catch (error) {
    console.error("Error fetching node details:", error);
    return NextResponse.json(
      { error: "Failed to fetch node details" },
      { status: 500 }
    );
  }
}
