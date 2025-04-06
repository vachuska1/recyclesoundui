"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "test_key")

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
}

export async function sendContactForm(formData: ContactFormData) {
  if (!formData.name || !formData.email || !formData.phone || !formData.message || !formData.consent) {
    throw new Error("All fields are required")
  }

  try {
    // For local development, we'll just log the form data
    console.log("Form data received:", formData)

    // In production, you would use Resend or another email service
    // This is commented out since we don't have a real API key in development
    /*
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'odhadyvachuska@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
      `,
    })

    if (error) {
      throw new Error(error.message)
    }
    */

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send message")
  }
}

