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
  if (!formData.consent) {
    throw new Error("Consent is required");
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailHtml = `
      <h1>Nová zpráva z kontaktního formuláře</h1>
      <p><strong>Jméno:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Telefon:</strong> ${formData.phone || 'Nevyplněno'}</p>
      <h3>Zpráva:</h3>
      <p>${formData.message}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Recyclesound <noreply@ekostat.cz>',
      to: 'vachuska@ekostat.cz',
      subject: `Nový kontakt od ${formData.name}`,
      html: emailHtml,
      replyTo: formData.email,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Neznámá chyba' 
    };
  }
}