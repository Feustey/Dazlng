import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("La variable d'environnement MONGODB_URI est requise");
}

const client = new MongoClient(MONGODB_URI);

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = client.db();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const pubkey = searchParams.get("pubkey");

    switch (action) {
      case "getAllNodes":
        const nodes = await db.collection("nodes").find({}).toArray();
        return NextResponse.json({
          nodes: nodes.map((node) => ({
            pubkey: node.pubkey,
            alias: node.alias,
            capacity: node.total_capacity,
            channels: node.active_channels,
            last_update: Math.floor(new Date(node.updated_at).getTime() / 1000),
          })),
        });

      case "getPeersOfPeers":
        if (!pubkey) {
          return NextResponse.json(
            { error: "Pubkey is required" },
            { status: 400 }
          );
        }
        const peers = await db
          .collection("peers")
          .find({ nodePubkey: pubkey })
          .toArray();
        return NextResponse.json({
          peers: peers.map((peer) => ({
            pubkey: peer.peerPubkey,
            alias: peer.alias,
            capacity: peer.total_capacity,
            numberOfChannels: peer.active_channels,
            lastUpdate: new Date(peer.last_update).toISOString(),
          })),
        });

      case "getCurrentStats":
        const stats = await db
          .collection("network_summary")
          .findOne({}, { sort: { timestamp: -1 } });
        if (!stats) {
          return NextResponse.json(
            { error: "No stats found" },
            { status: 404 }
          );
        }
        return NextResponse.json({
          stats: {
            total_nodes: stats.totalNodes,
            total_channels: stats.totalChannels,
            total_capacity: stats.totalCapacity,
            avg_capacity_per_channel: stats.avgChannelSize,
            avg_channels_per_node: stats.totalChannels / stats.totalNodes,
            timestamp: new Date(stats.timestamp).toISOString(),
          },
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
