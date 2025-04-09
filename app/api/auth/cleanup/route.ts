import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Database connection failed");
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const result = await db.collection("sessions").deleteMany({
      updatedAt: { $lt: oneHourAgo },
    });

    return NextResponse.json({
      message: `Deleted ${result.deletedCount} expired sessions`,
    });
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
