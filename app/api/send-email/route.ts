import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP configuration for ekostat.cz
const smtpConfig = {
  host: 'mail.ekostat.cz',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'vachuska@ekostat.cz',
    pass: 'Vaclav2025.'
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
};

export async function POST(request: Request) {
  console.log('Email request received');
  
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { subject, name, email, phone, message } = body;

    // Create reusable transporter object
    const transporter = nodemailer.createTransport(smtpConfig);

    // Email content
    const emailContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong> ${message || 'Not provided'}</p>
    `;

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'RecycleSound <vachuska@ekostat.cz>', // Sender address
      to: 'aless.vachuska@seznam.cz', // Send to your email
      replyTo: 'vachuska@ekostat.cz', // Replies will go to ekostat.cz
      subject: subject || 'New Contact Form Submission',
      html: emailContent
    });

    console.log('Message sent: %s', info.messageId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
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
