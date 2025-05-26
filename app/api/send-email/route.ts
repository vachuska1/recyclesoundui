import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log('Email request received');
  
  try {
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { to, subject, html, name, email, phone, message } = body;

    // Configuration for development (ethereal.email) and production
    let transporter: any;
    let from: string;
    let isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      console.log('Using production email settings');
      
      // Get SMTP settings from environment variables
      const smtpHost = process.env.SMTP_HOST || 'smtp.seznam.cz';
      const smtpPort = parseInt(process.env.SMTP_PORT || '465');
      const smtpUser = process.env.SMTP_USER || 'vachuska@ekostat.cz';
      const smtpPass = process.env.SMTP_PASS || 'Vaclav2025.';
      const smtpFrom = process.env.SMTP_FROM || 'RecycleSound Contact Form <vachuska@ekostat.cz>';
      
      console.log(`Connecting to SMTP: ${smtpUser}@${smtpHost}:${smtpPort}`);
      
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
      
      from = smtpFrom;
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
