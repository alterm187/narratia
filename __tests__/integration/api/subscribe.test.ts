import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/subscribe/route';
import { mockMailchimpClient } from '@/mocks/mailchimp';
import { mockSendGridClient } from '@/mocks/sendgrid';

// Mock dependencies
vi.mock('@mailchimp/mailchimp_marketing', () => ({
  default: mockMailchimpClient,
}));

vi.mock('@sendgrid/mail', () => ({
  default: mockSendGridClient,
}));

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
    process.env.SENDGRID_API_KEY = 'SG.test-key';
  });

  it('should subscribe user with minimal data (email + consent)', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'en',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockMailchimpClient.lists.addListMember).toHaveBeenCalled();
  });

  it('should subscribe with first name', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        firstName: 'John',
        consent: true,
        language: 'en',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockMailchimpClient.lists.addListMember).toHaveBeenCalledWith(
      'test-audience-id',
      expect.objectContaining({
        merge_fields: expect.objectContaining({
          FNAME: 'John',
        }),
      })
    );
  });

  it('should subscribe with essay lead magnet', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'en',
        leadMagnet: 'essay',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendGridClient.send).toHaveBeenCalled(); // Welcome email should be sent
  });

  it('should subscribe with chapters lead magnet', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'pl',
        leadMagnet: 'chapters',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendGridClient.send).toHaveBeenCalled();
  });

  it('should subscribe with newsletter-only', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'en',
        leadMagnet: 'newsletter',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Newsletter only should NOT send welcome email
    expect(mockSendGridClient.send).not.toHaveBeenCalled();
  });

  it('should add correct tags for essay download', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: true,
        language: 'en',
        leadMagnet: 'essay',
      }),
    });

    await POST(request);

    // Check that tags are passed correctly
    expect(mockMailchimpClient.lists.updateListMemberTags).toHaveBeenCalled();
  });

  it('should handle already subscribed user gracefully', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'duplicate@example.com',
        consent: true,
        language: 'en',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.alreadySubscribed).toBe(true);
  });

  it('should return 400 when email is missing', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consent: true,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 when email is invalid format', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        consent: true,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid email');
  });

  it('should return 400 when consent is false', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consent: false,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Consent');
  });

  it('should return 400 when consent is missing', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Consent');
  });

  it('should handle Mailchimp API errors', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'error@example.com',
        consent: true,
        language: 'en',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it('should not fail if SendGrid fails (non-blocking)', async () => {
    // Make SendGrid fail
    mockSendGridClient.send.mockRejectedValueOnce(new Error('SendGrid error'));

    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'John',
        consent: true,
        language: 'en',
        leadMagnet: 'essay',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still succeed even if email fails
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

describe('GET /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
  });

  it('should check if email is subscribed', async () => {
    const request = new Request('http://localhost:3000/api/subscribe?email=subscribed@example.com');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.subscribed).toBeDefined();
  });

  it('should return 400 when email parameter is missing', async () => {
    const request = new Request('http://localhost:3000/api/subscribe');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Email required');
  });
});
