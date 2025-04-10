import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { getAlbyService } from "@/services/albyService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const albyService = await getAlbyService();
    const { amount, memo } = await req.json();

    const invoice = await albyService.createInvoice({
      amount,
      memo,
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: "Payment error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
