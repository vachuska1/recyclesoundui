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
      
      // SMTP settings for ekostat.cz
      const smtpHost = 'mail.ekostat.cz';  // Your email provider's SMTP server
      const smtpPort = 465;  // Standard secure port for SMTP
      const smtpUser = 'vachuska@ekostat.cz';  // Your full email
      const smtpPass = 'Vaclav2025.';  // Your email password
      const smtpFrom = 'RecycleSound Contact Form <vachuska@ekostat.cz>';  // Sender name and email
      
      console.log('SMTP Configuration:', {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        // Don't log the password
        from: smtpFrom
      });
      
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
      console.log('Setting up development email with ethereal.email');
      
      try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal test account created');
        
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        from = `"RecycleSound Dev" <${testAccount.user}>`;
        
        console.log('Test email account created:');
        console.log('Email:', testAccount.user);
        console.log('Password:', testAccount.pass);
        console.log('Webmail URL: https://ethereal.email/');
      } catch (error) {
        console.error('Failed to create test account:', error);
        throw new Error('Failed to set up test email account');
      }
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
