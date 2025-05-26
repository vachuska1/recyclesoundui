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
  try {
    // In development, just log the email
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email would be sent to:', to);
      console.log('Subject:', subject);
      console.log('Content:', html);
      return { success: true };
    }

    // In production, use a serverless function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/send-email`, {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
}
