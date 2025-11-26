import { vi } from 'vitest';

// Mock SendGrid response
export const mockSendGridResponse = [
  {
    statusCode: 202,
    headers: {
      'x-message-id': 'mock-message-id-123',
    },
    body: '',
  },
  {},
];

// Mock SendGrid error
export const mockSendGridError = {
  code: 400,
  message: 'Invalid email address',
  response: {
    body: {
      errors: [{ message: 'Invalid email' }],
    },
  },
};

// Mock SendGrid client
export const mockSendGridClient = {
  setApiKey: vi.fn(),
  send: vi.fn((msg: { to: string | { email: string }[] }) => {
    if (msg.to === 'invalid@' || (Array.isArray(msg.to) && msg.to[0]?.email === 'error@example.com')) {
      const error = Object.assign(new Error('SendGrid API Error'), {
        code: 400,
        response: mockSendGridError.response
      });
      return Promise.reject(error);
    }
    return Promise.resolve(mockSendGridResponse);
  }),
  sendMultiple: vi.fn(() => Promise.resolve(mockSendGridResponse)),
};

// Export mock function to use in tests
export const createSendGridMock = () => mockSendGridClient;
