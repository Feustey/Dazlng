import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RateLimit } from "../lib/models/RateLimit";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function rateLimit(request: NextRequest) {
  const ip = request.ip || "unknown";
  const route = request.nextUrl.pathname;

  try {
    // Cleanup expired rate limits
    await RateLimit.cleanup();

    // Find or create rate limit record
    let rateLimit = await RateLimit.findOne({ ip, route });
    const now = new Date();

    if (!rateLimit) {
      // Create new rate limit record
      rateLimit = await RateLimit.create({
        ip,
        route,
        count: 1,
        resetAt: new Date(now.getTime() + WINDOW_SIZE),
      });
      return NextResponse.next();
    }

    // Check if rate limit has expired
    if (now > rateLimit.resetAt) {
      // Reset rate limit
      rateLimit = await RateLimit.update(rateLimit.id, {
        count: 1,
        resetAt: new Date(now.getTime() + WINDOW_SIZE),
      });
      return NextResponse.next();
    }

    // Check if rate limit has been exceeded
    if (rateLimit.count >= MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Please try again later",
          retryAfter: Math.ceil(
            (rateLimit.resetAt.getTime() - now.getTime()) / 1000
          ),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (rateLimit.resetAt.getTime() - now.getTime()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Increment rate limit count
    await RateLimit.update(rateLimit.id, {
      count: rateLimit.count + 1,
    });

    return NextResponse.next();
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.next();
  }
}
