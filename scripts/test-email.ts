import { sendEmail, sendWelcomeEmail } from '../lib/sendgrid';

async function testBasicEmail() {
  console.log('🧪 Testing basic email send...\n');

  const result = await sendEmail({
    to: 'sebastian.narratia@gmail.com',
    toName: 'Sebastian',
    subject: 'SendGrid Test Email',
    html: '<h1>Test Email</h1><p>This is a test email from Narratia.</p>',
    text: 'Test Email\n\nThis is a test email from Narratia.',
  });

  console.log('Result:', result);

  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Status Code:', result.statusCode);
  } else {
    console.error('❌ Failed to send email');
    console.error('Error:', result.error);
    if (result.details) {
      console.error('Details:', JSON.stringify(result.details, null, 2));
    }
  }
}

async function testWelcomeEmail() {
  console.log('\n🧪 Testing welcome email (essay)...\n');

  const result = await sendWelcomeEmail(
    'sebastian.narratia@gmail.com',
    'Sebastian',
    'pl',
    'essay'
  );

  console.log('Result:', result);

  if (result.success) {
    console.log('✅ Welcome email sent successfully!');
  } else {
    console.error('❌ Failed to send welcome email');
    console.error('Error:', result.error);
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('SendGrid Email Test');
  console.log('='.repeat(50));
  console.log();

  // Check if API key is configured
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not configured');
    console.log('Make sure you have .env.local file with SENDGRID_API_KEY set');
    process.exit(1);
  }

  console.log('✅ SENDGRID_API_KEY is configured');
  console.log('Key preview:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');
  console.log();

  try {
    // Test basic email
    await testBasicEmail();

    console.log('\n' + '='.repeat(50));

    // Test welcome email
    await testWelcomeEmail();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('\nCheck your inbox at sebastian.narratia@gmail.com');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

main();
