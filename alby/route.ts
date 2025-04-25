import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { AlbyWebhookService } from "../app/services/albyWebhook";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, description, filterTypes } = await req.json();

    if (!url || !description || !filterTypes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const webhook = await AlbyWebhookService.createWebhook(url);

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
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("alby_webhooks").select("*");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting webhooks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
