import { NextResponse } from 'next/server';
import { Resend } from 'resend';

interface EmailFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
  missingFields?: {
    name: boolean;
    email: boolean;
    message: boolean;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData: EmailFormData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      const missingFields = {
        name: !formData.name,
        email: !formData.email,
        message: !formData.message
      };
      
      return NextResponse.json<ErrorResponse>({
        error: 'Missing required fields',
        missingFields
      }, { status: 400 });
    }

    // Send email using Resend
    await resend.emails.send({
      from: 'RecycleSound <onboarding@resend.dev>',
      to: 'vachuska@ekostat.cz',
      subject: 'Nová zpráva z webu RecycleSound',
      replyTo: formData.email,
      html: `
        <h2>Nová zpráva z webu RecycleSound</h2>
        <p><strong>Jméno:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.phone ? `<p><strong>Telefon:</strong> ${formData.phone}</p>` : ''}
        <p><strong>Zpráva:</strong></p>
        <p>${formData.message}</p>
      `
    });

    return NextResponse.json<EmailResponse>({
      success: true,
      message: 'Zpráva byla úspěšně odeslána'
    });
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    return NextResponse.json<ErrorResponse>({
      error: 'Chyba při odesílání zprávy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
