import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, html, name, email, phone, message } = await request.json();

    // In development, use ethereal.email for testing
    let transporter: any;
    let from: string;

    if (process.env.NODE_ENV === 'production') {
      // Production configuration with provided credentials
      transporter = nodemailer.createTransport({
        host: 'smtp.seznam.cz',
        port: 465,
        secure: true,
        auth: {
          user: 'vachuska@ekostat.cz',
          pass: 'Vaclav2025.'
        },
      });
      from = '\"RecycleSound Contact Form\" <vachuska@ekostat.cz>';
    } else {
      // Development configuration (ethereal.email for testing)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      from = `"Test Sender" <${testAccount.user}>`;
      
      console.log('Test email account created:');
      console.log('Email:', testAccount.user);
      console.log('Password:', testAccount.pass);
    }

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from,
      to: to || process.env.EMAIL_TO || 'your-email@yourdomain.com',
      subject: subject || 'New Contact Form Submission',
      html: html || `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message || 'Not provided'}</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
