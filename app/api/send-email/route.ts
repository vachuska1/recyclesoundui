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
  // Enable debug and logging in development
  debug: true,
  logger: true,
  // Add connection timeout
  connectionTimeout: 15000, // 15 seconds
  // Add TLS options
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  },
  // Additional debugging
  socketTimeout: 15000,
  greetingTimeout: 15000
};

// Helper function to safely parse JSON
async function safeJsonParse(response: Response) {
  try {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.error('Failed to parse JSON. Raw response:', text);
      return { 
        error: 'Invalid JSON response',
        details: text,
        status: response.status,
        statusText: response.statusText
      };
    }
  } catch (error) {
    console.error('Failed to read response text:', error);
    return { 
      error: 'Failed to read response',
      details: String(error),
      status: response.status,
      statusText: response.statusText
    };
  }
}

export async function POST(request: Request) {
  console.log('Email sending process started', {
    time: new Date().toISOString(),
    env: {
      EMAIL_USER: process.env.EMAIL_USER ? 'set' : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  });
  
  try {
    let requestBody;
    try {
      const text = await request.text();
      try {
        requestBody = JSON.parse(text);
      } catch (jsonError) {
        console.error('Invalid JSON in request. Raw body:', text);
        return NextResponse.json(
          { 
            error: 'Invalid request body', 
            details: 'Request body must be valid JSON',
            received: text.substring(0, 200) // Log first 200 chars of invalid JSON
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error reading request body:', error);
      return NextResponse.json(
        { 
          error: 'Error reading request',
          details: error instanceof Error ? error.message : String(error)
        },
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

    // Create a transporter object
    console.log('Creating transporter with config:', {
      ...smtpConfig,
      auth: {
        user: smtpConfig.auth.user ? 'set' : 'not set',
        pass: smtpConfig.auth.pass ? 'set' : 'not set'
      }
    });
    
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection configuration
    try {
      console.log('Verifying SMTP connection to', smtpConfig.host, '...');
      await new Promise<void>((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.error('SMTP verify error:', {
              message: error.message,
              code: (error as any).code,
              stack: error.stack,
              command: (error as any).command
            });
            reject(error);
          } else {
            console.log('SMTP connection verified successfully');
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
