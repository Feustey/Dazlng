import { NextResponse } from "next/server";
import { getNodeDetails } from "@/app/lib/mcp";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const nodeDetails = await getNodeDetails(params.pubkey);
    return successResponse(nodeDetails);
  } catch (error) {
    console.error("Error fetching node details:", error);
    return errorResponse("Failed to fetch node details");
  }
}
