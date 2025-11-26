import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Check if rate limiting is enabled (Upstash credentials provided)
const isRateLimitEnabled = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create different rate limiters for different endpoints (only if enabled)
export const contactRateLimit = isRateLimitEnabled
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '15 m'), // 3 requests per 15 minutes
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

export const subscribeRateLimit = isRateLimitEnabled
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
      analytics: true,
      prefix: 'ratelimit:subscribe',
    })
  : null;

export const downloadRateLimit = isRateLimitEnabled
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 requests per hour
      analytics: true,
      prefix: 'ratelimit:download',
    })
  : null;

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : real;

  return ip || 'anonymous';
}

// Helper to check rate limit (gracefully skips if rate limiting is disabled)
export async function checkRateLimit(
  ratelimit: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; response?: NextResponse }> {
  // If rate limiting is not enabled, always allow the request
  if (!ratelimit || !isRateLimitEnabled) {
    return { success: true };
  }

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    if (!success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.floor((reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': new Date(reset).toISOString(),
              'Retry-After': Math.floor((reset - Date.now()) / 1000).toString(),
            },
          }
        ),
      };
    }

    return { success: true };
  } catch (error) {
    // If rate limiting fails (e.g., Redis connection issue), log but allow the request
    console.warn('Rate limiting check failed, allowing request:', error);
    return { success: true };
  }
}
