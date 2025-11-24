import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';
import DOMPurify from 'isomorphic-dompurify';
import { contactRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';
import validator from 'validator';
import { logSecurityEvent } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(contactRateLimit, identifier);

  if (!rateLimitResult.success) {
    await logSecurityEvent({
      type: 'rate_limit_exceeded',
      endpoint: '/api/contact',
      ip: identifier,
    });
    return rateLimitResult.response!;
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input presence
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Email is too long' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Validate email format with improved validation
    if (!validator.isEmail(email, {
      allow_display_name: false,
      require_tld: true,
      allow_utf8_local_part: false
    })) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Sanitize inputs for HTML context
    const sanitizedName = DOMPurify.sanitize(name, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    const sanitizedEmail = DOMPurify.sanitize(email, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    const sanitizedMessage = DOMPurify.sanitize(message, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    // Send email notification to owner
    const emailResult = await sendEmail({
      to: process.env.OWNER_EMAIL || 'sebastian.narratia@gmail.com',
      subject: `New Contact Form Message from ${sanitizedName}`,
      text: `
You have received a new contact form submission:

Name: ${sanitizedName}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
Sent from Narratia Contact Form
${new Date().toISOString()}
      `.trim(),
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>New Contact Form Submission</h2>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${sanitizedName}</p>
    <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
  </div>

  <div style="margin: 20px 0;">
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Sent from Narratia Contact Form<br>
    ${new Date().toISOString()}
  </p>
</div>
      `.trim(),
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    console.log('Contact form email sent successfully:', {
      name: sanitizedName,
      email: sanitizedEmail,
      messageId: emailResult.messageId,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
