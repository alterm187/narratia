import { http, HttpResponse } from 'msw';

export const handlers = [
  // Subscribe API
  http.post('/api/subscribe', async ({ request }) => {
    const body = await request.json() as any;

    // Validation
    if (!body.email) {
      return HttpResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!body.consent) {
      return HttpResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return HttpResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate duplicate
    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json(
        { success: true, alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Simulate Mailchimp error
    if (body.email === 'error@example.com') {
      return HttpResponse.json(
        { error: 'Mailchimp API error' },
        { status: 500 }
      );
    }

    // Success
    return HttpResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 200 }
    );
  }),

  // Contact API
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json() as any;

    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return HttpResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate SendGrid error
    if (body.email === 'error@example.com') {
      return HttpResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  }),

  // Download API
  http.get('/api/download/:filename', ({ params }) => {
    const { filename } = params;

    if (filename === 'non-existent.pdf') {
      return HttpResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Path traversal prevention
    if (typeof filename === 'string' && filename.includes('..')) {
      return HttpResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Return mock PDF buffer
    return HttpResponse.arrayBuffer(new ArrayBuffer(1024), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }),

  // Subscribe status check (GET)
  http.get('/api/subscribe', async ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return HttpResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    if (email === 'subscribed@example.com') {
      return HttpResponse.json(
        { subscribed: true, subscriber: { email, status: 'subscribed' } },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { subscribed: false },
      { status: 200 }
    );
  }),
];
