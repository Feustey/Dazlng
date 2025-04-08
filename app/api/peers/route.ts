import { getPeersOfPeers } from "../../services/network.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const nodePubkey = url.searchParams.get("nodePubkey");

    if (!nodePubkey) {
      return NextResponse.json(
        { error: "Le paramètre nodePubkey est requis" },
        { status: 400 }
      );
    }

    const peersData = await getPeersOfPeers(nodePubkey);
    return NextResponse.json(peersData);
  } catch (error) {
    console.error("Error fetching peers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des pairs" },
      { status: 500 }
    );
  }
}
