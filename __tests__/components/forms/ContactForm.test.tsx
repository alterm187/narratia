import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '@/components/ContactForm';

// Mock dictionary for tests
const mockDict = {
  contact: {
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
  },
} as any;

const mockDictPl = {
  contact: {
    form: {
      name: 'Imię',
      email: 'Email',
      message: 'Wiadomość',
      submit: 'Wyślij wiadomość',
      sending: 'Wysyłanie...',
      success: 'Wiadomość wysłana pomyślnie!',
      error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.',
    },
  },
} as any;

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('should render all required fields', () => {
      render(<ContactForm dict={mockDict} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should render with Polish labels', () => {
      render(<ContactForm dict={mockDictPl} />);

      expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /wyślij wiadomość/i })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should mark name as required', () => {
      render(<ContactForm dict={mockDict} />);
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeRequired();
    });

    it('should mark email as required', () => {
      render(<ContactForm dict={mockDict} />);
      const emailInput = screen.getByLabelText(/^email/i);
      expect(emailInput).toBeRequired();
    });

    it('should mark message as required', () => {
      render(<ContactForm dict={mockDict} />);
      const messageInput = screen.getByLabelText(/message/i);
      expect(messageInput).toBeRequired();
    });

    it('should have email input type', () => {
      render(<ContactForm dict={mockDict} />);
      const emailInput = screen.getByLabelText(/^email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Submission', () => {
    it('should submit form with valid data', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'John Doe',
              email: 'john@example.com',
              message: 'This is a test message',
            }),
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const mockFetch = vi.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }), 100))
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show loading text
      expect(screen.getByRole('button')).toHaveTextContent(/sending/i);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should disable submit button while sending', async () => {
      const mockFetch = vi.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }), 100))
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Success Flow', () => {
    it('should display success message after send', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    it('should reset form after successful submission', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('should clear success message after 5 seconds', async () => {
      vi.useFakeTimers();
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Fast-forward time
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText(/message sent successfully/i)).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should display error on API failure', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Error' }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const mockFetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });

    it('should clear error message after 5 seconds', async () => {
      vi.useFakeTimers();
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Error' }),
        })
      ) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });

      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText(/failed to send message/i)).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('should allow retry after error', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }) as any;
      global.fetch = mockFetch;

      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });

      // Clear the error
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText(/failed to send message/i)).not.toBeInTheDocument();
      });

      // Retry - need to re-enter data since form was reset
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message again');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<ContactForm dict={mockDict} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ContactForm dict={mockDict} />);

      // Tab through form
      await user.tab();
      expect(screen.getByLabelText(/name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/^email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/message/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /send message/i })).toHaveFocus();
    });
  });
});
