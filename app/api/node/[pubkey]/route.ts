import { NextResponse } from "next/server";
import { getNodeDetails } from "@/app/lib/mcp";

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const nodeDetails = await getNodeDetails(params.pubkey);
    return NextResponse.json(nodeDetails);
  } catch (error) {
    console.error("Error fetching node details:", error);
    return NextResponse.json(
      { error: "Failed to fetch node details" },
      { status: 500 }
    );
  }
}
