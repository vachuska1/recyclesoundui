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
  debug: true,
  logger: true
};

export async function POST(request: Request) {
  console.log('Email sending process started');
  
  try {
    const { name, email, phone, message } = await request.json();
    console.log('Request data received:', { name, email, phone: phone ? 'provided' : 'not provided' });

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a Nodemailer transporter
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection configuration
    try {
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during SMTP verification';
      console.error('SMTP connection verification failed:', error);
      return NextResponse.json(
        { 
          error: 'SMTP connection failed',
          details: errorMessage
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId 
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
