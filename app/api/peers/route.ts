"use server";

import { getPeersOfPeers } from "@/app/services/network.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const nodePubkey = url.searchParams.get("nodePubkey");

    if (!nodePubkey) {
      return NextResponse.json(
        { error: "Node pubkey is required" },
        { status: 400 }
      );
    }

    const peersData = await getPeersOfPeers(nodePubkey);
    return NextResponse.json(peersData);
  } catch (error) {
    console.error("Error fetching peers:", error);
    return NextResponse.json(
      { error: "Failed to fetch peers" },
      { status: 500 }
    );
  }
}
