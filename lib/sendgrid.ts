import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(params: EmailParams) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    const msg = {
      to: {
        email: params.to,
        name: params.toName,
      },
      from: {
        email: 'sebastian@narratia.pl',
        name: 'Sebastian Proba - Narratia',
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
    };

    const response = await sgMail.send(msg);

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      statusCode: response[0].statusCode,
    };
  } catch (error: any) {
    console.error('SendGrid error:', error);

    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
      details: error.response?.body,
    };
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string | undefined,
  language: 'pl' | 'en',
  leadMagnet: 'essay' | 'chapters'
) {
  const name = firstName || (language === 'pl' ? 'Czytelnik' : 'Reader');
  const isPl = language === 'pl';

  // Link to download pages (not direct PDFs)
  const downloadLink = leadMagnet === 'essay'
    ? `https://narratia.pl/${language}/download/essay`
    : `https://narratia.pl/${language}/download/chapters`;

  const subject = isPl
    ? `${leadMagnet === 'essay' ? 'Dla Ciebie: esej "Odbicie umysłu"' : 'Dla Ciebie: fragmenty książek'} - dziękuję za zainteresowanie! Przyjemnego czytania 😉`
    : `Your ${leadMagnet === 'essay' ? 'Essay "Reflection of the Mind"' : 'Chapter Samples'} - Thank You! Happy Reading 😉`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2a332a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #f1ede9 0%, #fff 100%); padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #2a332a; margin-top: 0;">${isPl ? `Cześć ${name}!` : `Hello ${name}!`}</h1>
    <p style="font-size: 18px; color: #2a332a;">
      ${isPl
        ? 'Dziękuję za zapis! Oto Twoje materiały do pobrania:'
        : 'Thank you for signing up! Here are your materials:'}
    </p>
  </div>

  <div style="background: #fff; border: 2px solid #ffbd59; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2a332a; margin-top: 0;">
      ${leadMagnet === 'essay'
        ? (isPl ? 'Odbicie umysłu' : 'Reflection of the Mind')
        : (isPl ? 'Fragmenty książek' : 'Chapter Samples')}
    </h2>
    <p style="color: #2a332a;">
      ${leadMagnet === 'essay'
        ? (isPl
          ? 'Esej o współpracy człowieka i AI w tłumaczeniu poezji Wordswortha.'
          : 'An essay about human-AI collaboration in translating Wordsworth\'s poetry.')
        : (isPl
          ? 'Pierwsze rozdziały z moich książek - zapoznaj się przed zakupem!'
          : 'First chapters from my books - try before you buy!')}
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadLink}"
         style="display: inline-block; background: #ffbd59; color: #191919; padding: 15px 40px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 18px;">
        ${isPl ? '📥 Pobierz materiały' : '📥 Download Materials'}
      </a>
    </div>
    <p style="font-size: 14px; color: #666; text-align: center;">
      ${isPl
        ? 'Nie widzisz przycisku? Kliknij tutaj:'
        : 'Can\'t see the button? Click here:'}
      <br>
      <a href="${downloadLink}" style="color: #ffbd59; word-break: break-all;">${downloadLink}</a>
    </p>
  </div>

  <div style="background: #fffbf0; border-left: 4px solid #ffbd59; padding: 20px; margin-bottom: 20px;">
    <p style="color: #2a332a; margin: 0; font-size: 15px;">
      <strong>${isPl ? '📬 O newsletterze:' : '📬 About the newsletter:'}</strong><br>
      ${isPl
        ? 'Maksymalnie kilka razy w roku wyślę Ci informacje o promocjach i nowych treściach. Żadnego spamu, obiecuję!'
        : 'I\'ll send you updates a few times a year about promotions and new content. No spam, I promise!'}
    </p>
  </div>

  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
    <p style="margin-bottom: 10px;">
      Sebastian Proba - Narratia
    </p>
    <p style="margin-bottom: 20px;">
      <a href="https://narratia.pl/${language}/books" style="color: #ffbd59; text-decoration: none;">
        ${isPl ? 'Zobacz wszystkie książki' : 'View All Books'}
      </a>
    </p>
    <p style="margin-top: 20px; font-size: 12px; color: #999;">
      ${isPl
        ? 'Otrzymujesz tę wiadomość, ponieważ zapisałeś się na listę Narratia.'
        : 'You\'re receiving this email because you signed up for Narratia.'}
    </p>
  </div>
</body>
</html>`;

  const textContent = `
${isPl ? `Cześć ${name}!` : `Hello ${name}!`}

${isPl
  ? 'Dziękuję za zapis! Oto Twoje materiały do pobrania:'
  : 'Thank you for signing up! Here are your materials:'}

${leadMagnet === 'essay'
  ? (isPl ? 'Odbicie umysłu' : 'Reflection of the Mind')
  : (isPl ? 'Fragmenty książek' : 'Chapter Samples')}

${leadMagnet === 'essay'
  ? (isPl
    ? 'Esej o współpracy człowieka i AI w tłumaczeniu poezji Wordswortha.'
    : 'An essay about human-AI collaboration in translating Wordsworth\'s poetry.')
  : (isPl
    ? 'Pierwsze rozdziały z moich książek - zapoznaj się przed zakupem!'
    : 'First chapters from my books - try before you buy!')}

${isPl ? 'Pobierz tutaj:' : 'Download here:'}
${downloadLink}

${isPl ? 'Co dalej?' : 'What\'s Next?'}

• ${isPl
  ? 'Będę wysyłać Ci informacje o nowych książkach i projektach'
  : 'I\'ll send you updates about new books and projects'}

• ${isPl
  ? 'Otrzymasz ekskluzywne oferty dostępne tylko dla czytelników'
  : 'You\'ll receive exclusive offers available only to readers'}

• ${isPl
  ? 'Możesz odpowiedzieć na ten email - chętnie porozmawiam!'
  : 'You can reply to this email - I\'d love to chat!'}

Sebastian Żurkowski - Narratia
https://narratia.pl/${language}/books

---
${isPl
  ? 'Otrzymujesz tę wiadomość, ponieważ zapisałeś się na listę Narratia.'
  : 'You\'re receiving this email because you signed up for Narratia.'}
`;

  return sendEmail({
    to: email,
    toName: firstName,
    subject,
    html: htmlContent,
    text: textContent,
  });
}
