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

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      const text = await response.text();
      console.error('Failed to parse JSON response:', text);
      responseData = { error: 'Invalid server response', details: text };
    }
    
    if (!response.ok) {
      console.error('Email API error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData
      });
      
      const errorMessage = responseData?.details?.message || 
                          responseData?.error || 
                          `Failed to send email: ${response.statusText}`;
      const error = new Error(errorMessage);
      (error as any).response = responseData;
      throw error;
    }

    console.log('Email sent successfully:', responseData);
    return { success: true, ...responseData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    console.error('Error in sendEmail:', errorMessage, error);
    throw new Error(errorMessage);
  }
}
