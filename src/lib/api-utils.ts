/**
 * API utility functions for secure error handling and rate limiting
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * Safe API error handler - never leaks sensitive info to client
 */
export function handleApiError(
  err: unknown,
  context: string,
  options: { expose?: string } = {}
) {
  const isDev = process.env.NODE_ENV === "development";

  // Log to console only in development
  if (isDev) {
    console.error(`[${context}]`, err);
  }

  // In production, you could send to external service (Sentry, etc)
  if (process.env.SENTRY_DSN && !isDev) {
    // TODO: Implement Sentry logging
  }

  // Return safe error message to client
  const message =
    options.expose ||
    "An error occurred. Please try again or contact support.";

  return NextResponse.json({ data: null, error: message }, { status: 500 });
}

/**
 * Rate limiting helper - tracks requests by IP
 * This is a basic in-memory implementation
 * For production, use Upstash Redis
 */
const requestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  // Clean up expired records
  if (record && now >= record.resetTime) {
    requestCounts.delete(identifier);
  }

  const current = requestCounts.get(identifier) || {
    count: 0,
    resetTime: now + windowMs,
  };

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetTime,
    };
  }

  current.count++;
  requestCounts.set(identifier, current);

  return {
    allowed: true,
    remaining: limit - current.count,
    resetAt: current.resetTime,
  };
}

/**
 * Extract client IP from request
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - note: req.ip is not available in Edge Runtime
  return "unknown";
}

/**
 * Validate Content-Type header
 */
export function validateContentType(req: Request): boolean {
  const contentType = req.headers.get("content-type");
  return contentType?.includes("application/json") ?? false;
}

/**
 * Create a rate-limited API response
 */
export function createRateLimitedResponse(
  req: Request,
  limit: number = 10,
  windowMs?: number
) {
  const ip = getClientIp(req);
  const result = checkRateLimit(ip, limit, windowMs);

  if (!result.allowed) {
    return {
      response: NextResponse.json(
        { data: null, error: "Rate limit exceeded" },
        { status: 429 }
      ),
      allowed: false,
    };
  }

  return {
    response: null,
    allowed: true,
    remaining: result.remaining,
    resetAt: result.resetAt,
  };
}

/**
 * Safe JSON response wrapper
 */
export function apiResponse<T>(
  data: T | null,
  error: string | null = null,
  status: number = 200
) {
  return NextResponse.json(
    { data, error },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

/**
 * Get authenticated user ID from Clerk
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId || null;
}

/**
 * Validate that user owns the session
 */
export async function validateSessionOwnership(
  sessionId: string,
  userId: string
): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  return session?.userId === userId;
}
