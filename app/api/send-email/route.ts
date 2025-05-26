import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_HNhPxssG_G8KWYVDSyNJihjRYzMAWggkS'); // Replace with your actual Resend API key

export async function POST(request: Request) {
  console.log('Email request received');
  
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { to, subject, html, name, email, phone, message } = body;

    // Determine if we're in production or development
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set up email content
    const emailContent = html || `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong> ${message || 'Not provided'}</p>
    `;

    // In production, send real email using Resend
    if (isProduction) {
      console.log('Sending email using Resend');
      
      const { data, error } = await resend.emails.send({
        from: 'RecycleSound <onboarding@resend.dev>',
        to: to || 'aless.vachuska@seznam.cz',
        subject: subject || 'New Contact Form Submission',
        html: emailContent,
        replyTo: email || 'no-reply@recyclesound.com'
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('Email sent via Resend:', data);
      return NextResponse.json({ success: true, messageId: data?.id });
    } 
    // In development, log the email
    else {
      console.log('Development mode - email would be sent with content:');
      console.log('To:', to || 'aless.vachuska@seznam.cz');
      console.log('Subject:', subject || 'New Contact Form Submission');
      console.log('Content:', emailContent);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (not sent in development)',
        preview: emailContent
      });
    }
    
    return NextResponse.json({ success: true, message: 'Email processed' });
  } catch (error: any) {
    // Log the complete error details
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response,
      command: error.command,
      responseCode: error.responseCode,
      responseMessage: error.responseMessage
    });

    // Return detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: {
          message: error.message,
          code: error.code,
          response: error.response
        }
      },
      { status: 500 }
    );
  }
}
