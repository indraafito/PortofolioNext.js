import { NextResponse } from 'next/server';

/**
 * Security headers middleware for Next.js API routes
 * Adds important security headers to responses
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://vercel.live",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  // Apply security headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Helper function to create response with security headers
 */
export function createSecureResponse(data?: any, init?: ResponseInit): NextResponse {
  const response = data ? NextResponse.json(data, init) : new NextResponse(null, init);
  return addSecurityHeaders(response);
}

/**
 * Wrapper for API handlers to automatically add security headers
 */
export function withSecurityHeaders<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const result = await handler(...args);
    
    // If the result is a NextResponse, add security headers
    if (result instanceof NextResponse) {
      return addSecurityHeaders(result) as R;
    }
    
    return result;
  };
}
