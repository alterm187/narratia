import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email notification to sebastian.narratia@gmail.com
    const emailResult = await sendEmail({
      to: 'sebastian.narratia@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      text: `
You have received a new contact form submission:

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from Narratia Contact Form
${new Date().toISOString()}
      `.trim(),
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>New Contact Form Submission</h2>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  </div>
  
  <div style="margin: 20px 0;">
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${message}</p>
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
      name,
      email,
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
