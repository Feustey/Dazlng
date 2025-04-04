import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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
    let rateLimit = await RateLimit.findByIpAndRoute(ip, route);
    const now = new Date();

    if (!rateLimit) {
      rateLimit = await RateLimit.create({
        ip,
        route,
        count: 1,
        resetAt: new Date(now.getTime() + WINDOW_SIZE),
      });
    } else {
      if (now > rateLimit.resetAt) {
        // Reset if window has passed
        rateLimit = await RateLimit.update(rateLimit.id, {
          count: 1,
          resetAt: new Date(now.getTime() + WINDOW_SIZE),
        });
      } else if (rateLimit.count >= MAX_REQUESTS) {
        // Rate limit exceeded
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests",
            message: "Please try again later",
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
      } else {
        // Increment count
        rateLimit = await RateLimit.update(rateLimit.id, {
          count: rateLimit.count + 1,
        });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.next();
  }
}
