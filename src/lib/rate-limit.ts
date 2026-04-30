// Simple in-memory rate limiting for development
// In production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export function createRateLimit(options: RateLimitOptions) {
  return function rateLimit(identifier: string): { success: boolean; resetTime?: number } {
    const now = Date.now();
    const existing = rateLimitStore.get(identifier);
    
    // Clean up expired entries
    if (existing && now > existing.resetTime) {
      rateLimitStore.delete(identifier);
    }
    
    const entry = rateLimitStore.get(identifier) || {
      count: 0,
      resetTime: now + options.windowMs
    };
    
    if (entry.count >= options.maxRequests) {
      return { 
        success: false, 
        resetTime: entry.resetTime 
      };
    }
    
    entry.count++;
    rateLimitStore.set(identifier, entry);
    
    return { success: true };
  };
}

// Pre-configured rate limiters
export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5 // 5 login attempts per 15 minutes
});

export const contactRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10 // 10 contact form submissions per hour
});

// Helper to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `rate-limit:${ip}`;
}
