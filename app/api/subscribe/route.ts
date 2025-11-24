import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscriberInfo } from '@/lib/mailchimp';
import { sendWelcomeEmail } from '@/lib/sendgrid';
import { subscribeRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';
import validator from 'validator';
import { logSecurityEvent } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(subscribeRateLimit, identifier);

  if (!rateLimitResult.success) {
    await logSecurityEvent({
      type: 'rate_limit_exceeded',
      endpoint: '/api/subscribe',
      ip: identifier,
    });
    return rateLimitResult.response!;
  }

  try {
    const body = await request.json();
    const { email, firstName, lastName, language, leadMagnet, consent } = body;

    // Validate email with improved validation
    if (!email || !validator.isEmail(email, {
      allow_display_name: false,
      require_tld: true,
      allow_utf8_local_part: false
    })) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate email length
    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (firstName && firstName.length > 100) {
      return NextResponse.json(
        { error: 'First name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    if (lastName && lastName.length > 100) {
      return NextResponse.json(
        { error: 'Last name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Validate GDPR consent
    if (!consent) {
      return NextResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Determine tags based on lead magnet
    const tags: string[] = [];

    if (leadMagnet === 'essay') {
      tags.push('essay-download', 'lead-magnet');
    } else if (leadMagnet === 'chapters') {
      tags.push('chapters-download', 'lead-magnet');
    } else if (leadMagnet === 'audio') {
      tags.push('audio-download', 'lead-magnet');
    } else if (leadMagnet === 'newsletter') {
      tags.push('newsletter-signup');
    }

    if (language) {
      tags.push(`lang-${language}`);
    }

    // Add to Mailchimp
    console.log('Adding subscriber to Mailchimp:', { email, firstName, tags });
    const result = await addSubscriber({
      email,
      firstName,
      lastName,
      language: language as 'pl' | 'en',
      leadMagnet,
      tags,
    });
    console.log('Mailchimp result:', { success: result.success, alreadySubscribed: result.alreadySubscribed });

    if (result.success) {
      // Send welcome email with download link if it's a lead magnet
      if (leadMagnet === 'essay' || leadMagnet === 'chapters') {
        const emailResult = await sendWelcomeEmail(
          email,
          firstName,
          language as 'pl' | 'en',
          leadMagnet as 'essay' | 'chapters'
        );

        if (!emailResult.success) {
          console.error('Failed to send welcome email:', emailResult.error);
          // Don't fail the entire request, just log the error
        }
      }

      return NextResponse.json({
        success: true,
        message: result.alreadySubscribed
          ? 'You are already subscribed!'
          : 'Successfully subscribed!',
        alreadySubscribed: result.alreadySubscribed || false,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const result = await getSubscriberInfo(email);

  if (result.success) {
    return NextResponse.json({
      subscribed: true,
      data: result.data,
    });
  } else {
    return NextResponse.json({
      subscribed: false,
    });
  }
}
