import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmailSignupForm from '@/components/EmailSignupForm';

describe('EmailSignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('should render inline variant with correct styling', () => {
      render(<EmailSignupForm variant="inline" language="en" />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('should render footer variant', () => {
      const { container } = render(<EmailSignupForm variant="footer" language="en" />);
      const form = container.querySelector('form');
      expect(form?.parentElement).toHaveClass('bg-[#2a332a]');
    });

    it('should render hero variant', () => {
      const { container } = render(<EmailSignupForm variant="hero" language="en" />);
      const form = container.querySelector('form');
      expect(form?.parentElement?.className).toContain('backdrop-blur-md');
    });

    it('should render lead-magnet variant with custom styling', () => {
      const { container } = render(<EmailSignupForm variant="lead-magnet" language="en" />);
      const form = container.querySelector('form');
      expect(form?.parentElement?.className).toContain('border-[#ffbd59]/30');
    });

    it('should render in Polish', () => {
      render(<EmailSignupForm language="pl" />);

      expect(screen.getByText(/Imię/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /zapisz się/i })).toBeInTheDocument();
      expect(screen.getByText(/Wyrażam zgodę/i)).toBeInTheDocument();
    });

    it('should render in English', () => {
      render(<EmailSignupForm language="en" />);

      expect(screen.getByText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
      expect(screen.getByText(/I agree to receive emails/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should mark email as required', () => {
      render(<EmailSignupForm language="en" />);
      const emailInput = screen.getByLabelText(/^email/i);
      expect(emailInput).toBeRequired();
    });

    it('should mark consent checkbox as required', () => {
      render(<EmailSignupForm language="en" />);
      const consentCheckbox = screen.getByRole('checkbox');
      expect(consentCheckbox).toBeRequired();
    });

    it('should mark first name as optional', () => {
      render(<EmailSignupForm language="en" />);
      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).not.toBeRequired();
    });

    it('should have email input type', () => {
      render(<EmailSignupForm language="en" />);
      const emailInput = screen.getByLabelText(/^email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with email only (minimal data)', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" leadMagnet="newsletter" />);

      const emailInput = screen.getByLabelText(/^email/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(consentCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/subscribe',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'test@example.com',
              firstName: '',
              language: 'en',
              leadMagnet: 'newsletter',
              consent: true,
            }),
          })
        );
      });
    });

    it('should submit form with email and first name', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/subscribe',
          expect.objectContaining({
            body: expect.stringContaining('"firstName":"John"'),
          })
        );
      });
    });

    it('should include language parameter (en)', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/subscribe',
          expect.objectContaining({
            body: expect.stringContaining('"language":"en"'),
          })
        );
      });
    });

    it('should include language parameter (pl)', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="pl" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /zapisz się/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/subscribe',
          expect.objectContaining({
            body: expect.stringContaining('"language":"pl"'),
          })
        );
      });
    });

    it('should include lead magnet type (essay)', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" leadMagnet="essay" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/subscribe',
          expect.objectContaining({
            body: expect.stringContaining('"leadMagnet":"essay"'),
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const mockFetch = vi.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        }), 100))
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      // Should show loading text
      expect(screen.getByRole('button')).toHaveTextContent(/subscribing/i);
      expect(screen.getByRole('button')).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });

    it('should disable submit button while loading', async () => {
      const mockFetch = vi.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        }), 100))
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));

      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Success Flow', () => {
    it('should display success message after subscription', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Successfully subscribed!' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
      });
    });

    it('should call onSuccess callback after successful subscription', async () => {
      const onSuccess = vi.fn();
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" onSuccess={onSuccess} />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should reset form fields after success', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement;
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
      const consentCheckbox = screen.getByRole('checkbox') as HTMLInputElement;

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'test@example.com');
      await user.click(consentCheckbox);
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(emailInput.value).toBe('');
        expect(firstNameInput.value).toBe('');
        expect(consentCheckbox.checked).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid email address' }),
        })
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      // Use valid email format to bypass HTML5 validation and test API error handling
      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      const mockFetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
      });
    });

    it('should show Polish error message for Polish language', async () => {
      const mockFetch = vi.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="pl" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /zapisz się/i }));

      await waitFor(() => {
        expect(screen.getByText(/wystąpił błąd/i)).toBeInTheDocument();
      });
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
          json: () => Promise.resolve({ success: true, message: 'Success' }),
        }) as unknown as typeof fetch;
      global.fetch = mockFetch;

      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Retry
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<EmailSignupForm language="en" />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/i agree to receive emails/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm language="en" />);

      // Tab through form
      await user.tab();
      expect(screen.getByLabelText(/first name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/^email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('checkbox')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /subscribe/i })).toHaveFocus();
    });
  });
});
