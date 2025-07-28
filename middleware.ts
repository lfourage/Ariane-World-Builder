import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const PROTECTED_ROUTES = ["/api/register", "/api/login"];

let ratelimit: any = null;

const hasEnv =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasEnv) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "middleware_rl",
  });
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  if (!ratelimit) {
    console.warn("Rate limit disabled: Upstash env vars missing.");
    return NextResponse.next();
  }

  const ip =
    req.ip ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}
