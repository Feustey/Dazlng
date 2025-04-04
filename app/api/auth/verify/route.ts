import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "../../../lib/auth";
import { runtime, errorResponse, successResponse } from "@/app/api/config";

export { runtime };

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return errorResponse("Token is required", 400);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return errorResponse("Invalid token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return errorResponse("Failed to verify token");
  }
}
