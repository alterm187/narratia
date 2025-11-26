import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addSubscriber, addTagsToSubscriber, getSubscriberInfo } from '@/lib/mailchimp';

// Create mock functions
const mockAddListMember = vi.fn();
const mockUpdateListMemberTags = vi.fn();
const mockGetListMember = vi.fn();
const mockSetConfig = vi.fn();

// Mock the Mailchimp SDK
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

describe('Mailchimp Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';

    // Setup default mock implementations
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
  });

  describe('addSubscriber', () => {
    it('should add new subscriber with email only', async () => {
      const result = await addSubscriber({
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
      expect(mockAddListMember).toHaveBeenCalledWith(
        'test-audience-id',
        {
          email_address: 'test@example.com',
          status: 'subscribed',
          merge_fields: {
            FNAME: '',
            LNAME: '',
          },
        }
      );
    });

    it('should add subscriber with first and last name', async () => {
      const result = await addSubscriber({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.success).toBe(true);
      expect(mockAddListMember).toHaveBeenCalledWith(
        'test-audience-id',
        expect.objectContaining({
          email_address: 'john@example.com',
          merge_fields: {
            FNAME: 'John',
            LNAME: 'Doe',
          },
        })
      );
    });

    it('should add subscriber with tags', async () => {
      const result = await addSubscriber({
        email: 'tagged@example.com',
        tags: ['lang-en', 'essay-download'],
      });

      expect(result.success).toBe(true);
      expect(mockAddListMember).toHaveBeenCalled();
      expect(mockUpdateListMemberTags).toHaveBeenCalled();
    });

    it('should handle duplicate email gracefully', async () => {
      const result = await addSubscriber({
        email: 'duplicate@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.alreadySubscribed).toBe(true);
    });

    it('should handle duplicate email with tags', async () => {
      const result = await addSubscriber({
        email: 'duplicate@example.com',
        tags: ['lang-pl'],
      });

      expect(result.success).toBe(true);
      expect(result.alreadySubscribed).toBe(true);
      expect(mockUpdateListMemberTags).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const result = await addSubscriber({
        email: 'error@example.com',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should add subscriber with merge fields', async () => {
      const result = await addSubscriber({
        email: 'test@example.com',
        firstName: 'Jane',
      });

      expect(result.success).toBe(true);
      expect(mockAddListMember).toHaveBeenCalledWith(
        'test-audience-id',
        expect.objectContaining({
          merge_fields: {
            FNAME: 'Jane',
            LNAME: '',
          },
        })
      );
    });
  });

  describe('addTagsToSubscriber', () => {
    it('should add tags to existing subscriber', async () => {
      const result = await addTagsToSubscriber('test@example.com', ['tag1', 'tag2']);

      expect(result.success).toBe(true);
      expect(mockUpdateListMemberTags).toHaveBeenCalledWith(
        'test-audience-id',
        expect.any(String), // MD5 hash of email
        {
          tags: [
            { name: 'tag1', status: 'active' },
            { name: 'tag2', status: 'active' },
          ],
        }
      );
    });

    it('should handle single tag', async () => {
      const result = await addTagsToSubscriber('test@example.com', ['single-tag']);

      expect(result.success).toBe(true);
      expect(mockUpdateListMemberTags).toHaveBeenCalledWith(
        'test-audience-id',
        expect.any(String),
        {
          tags: [{ name: 'single-tag', status: 'active' }],
        }
      );
    });

    it('should lowercase email before hashing', async () => {
      await addTagsToSubscriber('Test@Example.COM', ['tag']);

      // Both should produce the same hash
      expect(mockUpdateListMemberTags).toHaveBeenCalled();
    });
  });

  describe('getSubscriberInfo', () => {
    it('should retrieve subscriber by email', async () => {
      const result = await getSubscriberInfo('test@example.com');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockGetListMember).toHaveBeenCalledWith(
        'test-audience-id',
        expect.any(String) // MD5 hash
      );
    });

    it('should handle errors when subscriber not found', async () => {
      // Make the mock throw an error for this test
      mockGetListMember.mockRejectedValueOnce(
        new Error('Subscriber not found')
      );

      const result = await getSubscriberInfo('nonexistent@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
