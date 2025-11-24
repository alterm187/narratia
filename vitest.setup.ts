import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// MSW server setup
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });

  // Mock environment variables
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  process.env.MAILCHIMP_API_KEY = 'test-mailchimp-key-us10';
  process.env.MAILCHIMP_SERVER_PREFIX = 'us10';
  process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
  process.env.SENDGRID_API_KEY = 'SG.test-sendgrid-key';
  process.env.OWNER_EMAIL = 'test@narratia.com';
  // Mock Upstash Redis environment variables
  process.env.UPSTASH_REDIS_REST_URL = 'https://test-redis.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token';
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// Mock Vercel Analytics
vi.mock('@vercel/analytics', () => ({
  track: vi.fn((event, data) => {
    console.log(`[Analytics Mock] ${event}`, data);
  }),
  Analytics: () => null,
}));

// Mock Vercel Analytics Server
vi.mock('@vercel/analytics/server', () => ({
  track: vi.fn((event, data) => {
    console.log(`[Analytics Server Mock] ${event}`, data);
    return Promise.resolve();
  }),
}));

// Mock Rate Limiting
vi.mock('@/lib/ratelimit', () => ({
  contactRateLimit: {
    limit: vi.fn(() => Promise.resolve({ success: true, limit: 3, reset: Date.now() + 900000, remaining: 2 })),
  },
  subscribeRateLimit: {
    limit: vi.fn(() => Promise.resolve({ success: true, limit: 5, reset: Date.now() + 3600000, remaining: 4 })),
  },
  downloadRateLimit: {
    limit: vi.fn(() => Promise.resolve({ success: true, limit: 20, reset: Date.now() + 3600000, remaining: 19 })),
  },
  getClientIdentifier: vi.fn(() => 'test-client-ip'),
  checkRateLimit: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock Security Logger
vi.mock('@/lib/security-logger', () => ({
  logSecurityEvent: vi.fn(() => Promise.resolve()),
}));

// Mock DOMPurify
vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: vi.fn((input) => input),
  },
}));

// Mock validator
vi.mock('validator', () => ({
  default: {
    isEmail: vi.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  },
}));

// Mock server-only package
vi.mock('server-only', () => ({}));
