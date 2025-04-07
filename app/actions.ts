"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    // V produkčním prostředí odešleme e-mail
    if (process.env.NODE_ENV === "production") {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.NEXT_PUBLIC_RESEND_EMAIL || 'aless.vachuska@seznam.cz',
        subject: `Nový kontakt od ${formData.name}`,
        html: `
          <h1>Nová zpráva z kontaktního formuláře</h1>
          <p><strong>Jméno:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Telefon:</strong> ${formData.phone}</p>
          <p><strong>Zpráva:</strong> ${formData.message}</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // V developmentu pouze logujeme
      console.log("E-mail by byl odeslán s těmito daty:", formData);
    }

    return { success: true };
  } catch (error) {
    console.error("Chyba při odesílání e-mailu:", error);
    throw new Error("Failed to send message");
  }
}