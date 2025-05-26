import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP configuration for ekostat.cz
const smtpConfig = {
  host: 'smtp.ekostat.cz',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Add debug and logger for more detailed error information
  debug: process.env.NODE_ENV !== 'production',
  logger: process.env.NODE_ENV !== 'production',
  // Add connection timeout
  connectionTimeout: 10000, // 10 seconds
  // Add TLS options
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
};

// Helper function to safely parse JSON
async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    const text = await response.text();
    console.error('Failed to parse JSON response:', text);
    return { error: 'Invalid response from server', details: text };
  }
}

export async function POST(request: Request) {
  console.log('Email sending process started');
  
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      console.error('Invalid JSON in request:', error);
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = requestBody;
    console.log('Request data received:', { name, email, phone: phone ? 'provided' : 'not provided' });

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields');
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: {
            name: !name,
            email: !email,
            message: !message
          }
        },
        { status: 400 }
      );
    }

    // Create a Nodemailer transporter
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection configuration
    try {
      console.log('Verifying SMTP connection...');
      await new Promise<void>((resolve, reject) => {
        transporter.verify((error) => {
          if (error) {
            console.error('SMTP verify error:', error);
            reject(error);
          } else {
            console.log('Server is ready to take our messages');
            resolve();
          }
        });
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during SMTP verification';
      console.error('SMTP connection verification failed:', error);
      return NextResponse.json(
        { 
          error: 'SMTP connection failed',
          details: errorMessage,
          code: (error as any).code
        },
        { status: 500 }
      );
    }

    // Prepare email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: 'vachuska@ekostat.cz',
      replyTo: email,
      subject: 'Nová zpráva z webu RecycleSound',
      text: `
        Jméno: ${name}
        Email: ${email}
        Telefon: ${phone || 'Nezadáno'}
        Zpráva: ${message}
      `,
      html: `
        <h2>Nová zpráva z webu RecycleSound</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        <p><strong>Zpráva:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    console.log('Sending email with options:', {
      ...mailOptions,
      auth: { user: process.env.EMAIL_USER ? 'set' : 'not set' }
    });

    // Send mail with defined transport object
    console.log('Sending email...');
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Message sent:', info.messageId);
          resolve(info);
        }
      });
    });

    return NextResponse.json({ 
      success: true,
      messageId: (info as any).messageId 
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in send-email API:', {
        message: error.message,
        stack: error.stack,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).response && { response: (error as any).response },
        ...(error as any).command && { command: (error as any).command }
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    console.error('Unknown error in send-email API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: 'An unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
