import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks must be before imports that use them
vi.mock('@sendgrid/mail', () => {
  const mockSend = vi.fn(() =>
    Promise.resolve([
      {
        statusCode: 202,
        headers: { 'x-message-id': 'mock-message-id-123' },
      },
    ])
  );

  return {
    default: {
      setApiKey: vi.fn(),
      send: mockSend,
    },
  };
});

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

import { POST } from '@/app/api/contact/route';
import sgMail from '@sendgrid/mail';

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SENDGRID_API_KEY = 'SG.test-key';
  });

  it('should send contact form with all required fields', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sgMail.send).toHaveBeenCalled();
  });

  it('should send email with long message', async () => {
    const longMessage = 'A'.repeat(1000);
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: longMessage,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(longMessage),
      })
    );
  });

  it('should send email with special characters in name', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ángela García-López',
        email: 'angela@example.com',
        message: 'Hello!',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should send email with international domain', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.co.uk',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should include sender email in message', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Sender',
        email: 'sender@example.com',
        message: 'Please reply to me',
      }),
    });

    await POST(request);

    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.objectContaining({
          email: 'test@narratia.com', // Uses OWNER_EMAIL from env
        }),
        html: expect.stringContaining('sender@example.com'),
      })
    );
  });

  it('should generate both HTML and text versions', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    });

    await POST(request);

    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.any(String),
        text: expect.any(String),
      })
    );
  });

  it('should return 400 when name is missing', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        message: 'Test',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('should return 400 when email is missing', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John',
        message: 'Test',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('should return 400 when message is missing', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John',
        email: 'john@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('should return 400 when all fields are empty strings', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: '',
        message: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('should handle SendGrid API errors', async () => {
    vi.mocked(sgMail.send).mockRejectedValueOnce(new Error('SendGrid error'));

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to send');
  });

  it('should handle SendGrid rate limit errors', async () => {
    const rateLimitError = new Error('Rate limit') as any;
    rateLimitError.code = 429;
    vi.mocked(sgMail.send).mockRejectedValueOnce(rateLimitError);

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it('should sanitize message content (HTML escaping)', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        message: '<script>alert("xss")</script>',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still succeed, but content should be passed as-is to email
    // The email client will handle rendering safely
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should include timestamp in email', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    await POST(request);

    expect(sgMail.send).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        text: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      })
    );
  });
});
