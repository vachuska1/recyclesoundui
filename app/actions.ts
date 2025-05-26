"use server";

import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export async function sendContactForm(formData: ContactFormData) {
  console.log('Starting sendContactForm', { formData });
  
  if (!formData.consent) {
    console.log('Consent missing');
    return { success: false, error: "Consent is required" };
  }

  try {
    // Log the API key (only first 5 chars for security)
    const apiKey = process.env.RESEND_API_KEY;
    console.log('API Key available:', !!apiKey);
    if (apiKey) {
      console.log('API Key starts with:', apiKey.substring(0, 5));
    } else {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return { success: false, error: 'API key not configured' };
    }
    
    const resend = new Resend(apiKey);
    
    const emailHtml = `
      <h1>Nová zpráva z kontaktního formuláře</h1>
      <p><strong>Jméno:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Telefon:</strong> ${formData.phone || 'Nevyplněno'}</p>
      <h3>Zpráva:</h3>
      <p>${formData.message}</p>
    `;

    console.log('Sending email to:', 'vachuska@ekostat.cz');
    
    const emailOptions = {
      from: 'Recyclesound <onboarding@resend.dev>', // Changed to verified domain in Resend
      to: 'vachuska@ekostat.cz',
      subject: `Nový kontakt od ${formData.name}`,
      html: emailHtml,
      replyTo: formData.email,
    };
    
    console.log('Email options:', emailOptions);
    
    const { data, error } = await resend.emails.send(emailOptions);
    
    console.log('Resend response data:', data);

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: `Email error: ${error.message}` };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? `Exception: ${error.message}` : 'Neznámá chyba' 
    };
  }
}