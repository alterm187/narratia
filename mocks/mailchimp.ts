import { vi } from 'vitest';

// Mock subscriber response
export const mockSubscriberResponse = {
  id: 'mock-subscriber-id-123',
  email_address: 'test@example.com',
  unique_email_id: 'unique-123',
  status: 'subscribed',
  merge_fields: {
    FNAME: 'John',
    LNAME: 'Doe',
  },
  tags: [
    { id: 1, name: 'lang-en' },
    { id: 2, name: 'essay-download' },
  ],
};

// Mock duplicate error
export const mockDuplicateError = {
  status: 400,
  title: 'Member Exists',
  detail: 'test@example.com is already a list member.',
  type: 'http://developer.mailchimp.com/documentation/mailchimp/guides/error-glossary/',
};

// Mock Mailchimp client
export const mockMailchimpClient = {
  setConfig: vi.fn(),
  lists: {
    addListMember: vi.fn((audienceId: string, data: any) => {
      if (data.email_address === 'duplicate@example.com') {
        const error = new Error('Member Exists') as any;
        error.status = 400;
        error.title = 'Member Exists';
        error.response = { body: mockDuplicateError };
        throw error;
      }
      if (data.email_address === 'error@example.com') {
        const error = new Error('Mailchimp API Error') as any;
        error.status = 500;
        throw error;
      }
      return Promise.resolve({
        ...mockSubscriberResponse,
        email_address: data.email_address,
        merge_fields: data.merge_fields || {},
      });
    }),
    updateListMemberTags: vi.fn(() => Promise.resolve({ tags: [] })),
    getListMember: vi.fn((audienceId: string, subscriberHash: string) => {
      return Promise.resolve(mockSubscriberResponse);
    }),
    setListMember: vi.fn((audienceId: string, subscriberHash: string, data: any) => {
      return Promise.resolve({
        ...mockSubscriberResponse,
        email_address: data.email_address,
        merge_fields: data.merge_fields || {},
      });
    }),
  },
};

// Export mock function to use in tests
export const createMailchimpMock = () => mockMailchimpClient;
