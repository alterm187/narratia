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
