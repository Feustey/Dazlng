import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CheckoutSession from "@/models/CheckoutSession";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await req.json();

    const checkoutSession = await CheckoutSession.create({
      userId: session.user.id,
      ...data,
    });

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const checkoutSession = await CheckoutSession.findOne({
      _id: sessionId,
      userId: session.user.id,
    });

    if (!checkoutSession) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error getting checkout session:", error);
    return NextResponse.json(
      { error: "Failed to get checkout session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");
    const data = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const checkoutSession = await CheckoutSession.findOneAndUpdate(
      {
        _id: sessionId,
        userId: session.user.id,
      },
      { $set: data },
      { new: true }
    );

    if (!checkoutSession) {
      return NextResponse.json(
        { error: "Checkout session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error updating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to update checkout session" },
      { status: 500 }
    );
  }
}
