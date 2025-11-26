import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/subscribe/route';

// Create mock functions for Mailchimp
const mockAddListMember = vi.fn();
const mockUpdateListMemberTags = vi.fn();
const mockGetListMember = vi.fn();
const mockSetConfig = vi.fn();

// Create mock functions for SendGrid
const mockSendGridSend = vi.fn();
const mockSetApiKey = vi.fn();

// Mock dependencies
vi.mock('@mailchimp/mailchimp_marketing', () => ({
  default: {
    setConfig: mockSetConfig,
    lists: {
      addListMember: mockAddListMember,
      updateListMemberTags: mockUpdateListMemberTags,
      getListMember: mockGetListMember,
    },
  },
}));

vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: mockSetApiKey,
    send: mockSendGridSend,
  },
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

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';
    process.env.SENDGRID_API_KEY = 'SG.test-key';

    // Setup Mailchimp mock implementations
    mockAddListMember.mockImplementation((audienceId: string, data: any) => {
      if (data.email_address === 'duplicate@example.com') {
        const error = new Error('Member Exists') as any;
        error.status = 400;
        error.title = 'Member Exists';
        error.response = {
          body: {
            status: 400,
            title: 'Member Exists',
            detail: 'test@example.com is already a list member.',
          }
        };
        throw error;
      }
      if (data.email_address === 'error@example.com') {
        const error = new Error('Mailchimp API Error') as any;
        error.status = 500;
        throw error;
      }
      return Promise.resolve({
        id: 'mock-subscriber-id-123',
        email_address: data.email_address,
        unique_email_id: 'unique-123',
        status: 'subscribed',
        merge_fields: data.merge_fields || {},
      });
    });

    mockUpdateListMemberTags.mockResolvedValue({ tags: [] });
    mockGetListMember.mockResolvedValue({
      id: 'mock-subscriber-id-123',
      email_address: 'test@example.com',
      unique_email_id: 'unique-123',
      status: 'subscribed',
      merge_fields: {
        FNAME: 'John',
        LNAME: 'Doe',
      },
    });

    // Setup SendGrid mock implementation
    mockSendGridSend.mockResolvedValue([
      {
        statusCode: 202,
        headers: {
          'x-message-id': 'mock-message-id-123',
        },
        body: '',
      },
      {},
    ]);
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
    expect(mockAddListMember).toHaveBeenCalled();
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
    expect(mockAddListMember).toHaveBeenCalledWith(
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
    expect(mockSendGridSend).toHaveBeenCalled(); // Welcome email should be sent
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
    expect(mockSendGridSend).toHaveBeenCalled();
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
    expect(mockSendGridSend).not.toHaveBeenCalled();
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
    expect(mockUpdateListMemberTags).toHaveBeenCalled();
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
    mockSendGridSend.mockRejectedValueOnce(new Error('SendGrid error'));

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

    // Setup mock for GET requests
    mockGetListMember.mockResolvedValue({
      id: 'mock-subscriber-id-123',
      email_address: 'subscribed@example.com',
      unique_email_id: 'unique-123',
      status: 'subscribed',
      merge_fields: {
        FNAME: 'John',
        LNAME: 'Doe',
      },
    });
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
