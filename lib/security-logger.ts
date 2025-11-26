import { track } from '@vercel/analytics/server';

export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'path_traversal_attempt'
  | 'xss_attempt_blocked'
  | 'file_not_whitelisted'
  | 'email_validation_failed'
  | 'suspicious_request';

interface SecurityEventData {
  type: SecurityEventType;
  endpoint: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export async function logSecurityEvent(data: SecurityEventData) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Track with Vercel Analytics
  try {
    await track('security_event', {
      type: data.type,
      endpoint: data.endpoint,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track security event:', error);
  }

  // In production, you might want to send to a logging service
  // Examples: Sentry, LogRocket, Datadog, etc.
  if (process.env.NODE_ENV === 'production') {
    // Add your logging service here
    // Example: Sentry.captureMessage(...)
  }
}
