import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail, sendWelcomeEmail } from '@/lib/sendgrid';
import { mockSendGridClient } from '@/mocks/sendgrid';

// Mock the SendGrid SDK
vi.mock('@sendgrid/mail', () => ({
  default: mockSendGridClient,
}));

// Mock DOMPurify
vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: vi.fn((input) => input),
  },
}));

describe('SendGrid Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SENDGRID_API_KEY = 'SG.test-key';
  });

  describe('sendEmail', () => {
    it('should send plain text email', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('mock-message-id-123');
      expect(result.statusCode).toBe(202);
      expect(mockSendGridClient.send).toHaveBeenCalled();
    });

    it('should send email with recipient name', async () => {
      const result = await sendEmail({
        to: 'john@example.com',
        toName: 'John Doe',
        subject: 'Hello John',
        html: '<p>Hello</p>',
        text: 'Hello',
      });

      expect(result.success).toBe(true);
      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: {
            email: 'john@example.com',
            name: 'John Doe',
          },
        })
      );
    });

    it('should include from address', async () => {
      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      });

      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: {
            email: 'sebastian@narratia.pl',
            name: 'Sebastian Proba - Narratia',
          },
        })
      );
    });

    it('should handle SendGrid errors', async () => {
      const result = await sendEmail({
        to: 'error@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should throw error if API key not configured', async () => {
      delete process.env.SENDGRID_API_KEY;

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('SENDGRID_API_KEY');

      // Restore for other tests
      process.env.SENDGRID_API_KEY = 'SG.test-key';
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should generate essay download email in English', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        'John',
        'en',
        'essay'
      );

      expect(result.success).toBe(true);
      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: {
            email: 'test@example.com',
            name: 'John',
          },
          subject: expect.stringContaining('Essay'),
        })
      );
    });

    it('should generate essay download email in Polish', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        'Jan',
        'pl',
        'essay'
      );

      expect(result.success).toBe(true);
      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('esej'),
        })
      );
    });

    it('should generate chapters download email in English', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        'John',
        'en',
        'chapters'
      );

      expect(result.success).toBe(true);
      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Chapter'),
        })
      );
    });

    it('should generate chapters download email in Polish', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        'Jan',
        'pl',
        'chapters'
      );

      expect(result.success).toBe(true);
      expect(mockSendGridClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('fragmenty'),
        })
      );
    });

    it('should use default greeting when no first name provided (English)', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        undefined,
        'en',
        'essay'
      );

      expect(result.success).toBe(true);
      // The email should use "Reader" as default
      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toContain('Reader');
    });

    it('should use default greeting when no first name provided (Polish)', async () => {
      const result = await sendWelcomeEmail(
        'test@example.com',
        undefined,
        'pl',
        'essay'
      );

      expect(result.success).toBe(true);
      // The email should use "Czytelnik" as default
      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toContain('Czytelnik');
    });

    it('should include download link in email', async () => {
      await sendWelcomeEmail('test@example.com', 'John', 'en', 'essay');

      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toContain('api/download/odbicie-umyslu.pdf');
    });

    it('should generate both HTML and text versions', async () => {
      await sendWelcomeEmail('test@example.com', 'John', 'en', 'essay');

      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toBeDefined();
      expect(call.text).toBeDefined();
      expect(call.html.length).toBeGreaterThan(0);
      expect(call.text.length).toBeGreaterThan(0);
    });

    it('should personalize with first name', async () => {
      await sendWelcomeEmail('test@example.com', 'Jane', 'en', 'essay');

      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toContain('Jane');
      expect(call.text).toContain('Jane');
    });

    it('should include correct download link for chapters', async () => {
      await sendWelcomeEmail('test@example.com', 'John', 'en', 'chapters');

      const call = mockSendGridClient.send.mock.calls[0][0];
      expect(call.html).toContain('/en/download/chapters');
    });
  });
});
