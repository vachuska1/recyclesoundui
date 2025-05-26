"use server";

import { sendEmail } from '@/lib/email';

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
    const emailHtml = `
      <h1>Nová zpráva z kontaktního formuláře</h1>
      <p><strong>Jméno:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Telefon:</strong> ${formData.phone || 'Nevyplněno'}</p>
      <h3>Zpráva:</h3>
      <p>${formData.message}</p>
    `;

    // Always try to send the email in both development and production
    // In development, it will use ethereal.email for testing
    await sendEmail({
      to: 'aless.vachuska@seznam.cz', // Your recipient email
      subject: `Nový kontakt od ${formData.name}`,
      html: emailHtml,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Nepodařilo se odeslat zprávu. Zkuste to prosím znovu později.");
  }
}