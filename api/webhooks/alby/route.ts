import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../app/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/lib/auth";
import { AlbyWebhookService } from "../../../app/services/albyWebhook";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, description } = await req.json();

    if (!url || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const webhook = await AlbyWebhookService.createWebhook(url);

    if (!webhook) {
      return NextResponse.json(
        { error: "Failed to create webhook" },
        { status: 500 }
      );
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer l'ID du webhook depuis les paramètres de la requête si disponible
    const url = new URL(req.url);
    const endpointId = url.searchParams.get("endpointId");

    if (!endpointId) {
      return NextResponse.json(
        { error: "Missing endpoint ID" },
        { status: 400 }
      );
    }

    const webhook = await AlbyWebhookService.getWebhook(endpointId);

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error("Error getting webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
