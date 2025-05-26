"use server";

import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(formData: ContactFormData) {
  if (!formData.consent) {
    throw new Error("Consent is required");
  }

  try {
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
      throw new Error('Nepodařilo se odeslat zprávu přes emailovou službu.');
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Nepodařilo se odeslat zprávu. Zkuste to prosím znovu později.");
  }
}