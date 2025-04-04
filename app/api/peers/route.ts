import { NextResponse } from "next/server";
import mcpService from "@/app/lib/mcpService";

export async function GET() {
  try {
    const nodePubkey = process.env.NODE_PUBKEY;
    if (!nodePubkey) {
      throw new Error(
        "NODE_PUBKEY non défini dans les variables d'environnement"
      );
    }

    const peersData = await mcpService.getPeersOfPeers(nodePubkey);
    return NextResponse.json(peersData);
  } catch (error) {
    console.error("Erreur lors de la récupération des pairs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des pairs" },
      { status: 500 }
    );
  }
}
