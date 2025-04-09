import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { ISession } from "../../../lib/models/Session";
import { WithId, Document } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Récupérer les statistiques du réseau
    const [nodes, sessionsDoc] = await Promise.all([
      db
        .collection("nodes")
        .aggregate([
          {
            $group: {
              _id: null,
              totalNodes: { $sum: 1 },
              onlineNodes: {
                $sum: {
                  $cond: [{ $eq: ["$status", "online"] }, 1, 0],
                },
              },
              totalPeers: { $sum: "$peers" },
              averageBlockHeight: { $avg: "$blockHeight" },
            },
          },
        ])
        .toArray(),
      db.collection("sessions").find({}).toArray(),
    ]);

    const sessions = sessionsDoc.map((doc: WithId<Document>) => ({
      sessionId: doc.sessionId,
      userId: doc.userId,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    })) as ISession[];

    const networkStats = nodes[0] || {
      totalNodes: 0,
      onlineNodes: 0,
      totalPeers: 0,
      averageBlockHeight: 0,
    };

    return NextResponse.json({
      ...networkStats,
      activeSessions: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching network summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
