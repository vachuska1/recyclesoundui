import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export async function sendEmail({ to, subject, html, ...data }: EmailOptions) {
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://recyclesoundui.vercel.app/api/send-email'
    : '/api/send-email';

  console.log(`Sending email via: ${apiUrl}`);
  console.log('To:', to);
  console.log('Subject:', subject);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        ...data
      }),
    });

    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('Email API error:', response.status, responseData);
      throw new Error(responseData.error || `Failed to send email: ${response.statusText}`);
    }

    console.log('Email sent successfully:', responseData);
    return { success: true, ...responseData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    console.error('Error in sendEmail:', errorMessage, error);
    throw new Error(errorMessage);
  }
}
