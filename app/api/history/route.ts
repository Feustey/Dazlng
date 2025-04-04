import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function GET() {
  try {
    const history = await prisma.history.findMany({
      orderBy: {
        date: "desc",
      },
      take: 100,
    });

    return successResponse(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return errorResponse("Failed to fetch history");
  }
}
