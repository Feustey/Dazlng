import { NextRequest, NextResponse } from "next/server";
import { fetchNodeInfo } from "../../../lib/services/nodeService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nodeDetails = await fetchNodeInfo(params.id);
    if (!nodeDetails) {
      return NextResponse.json({ error: "Nœud non trouvé" }, { status: 404 });
    }
    return NextResponse.json(nodeDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du nœud:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
