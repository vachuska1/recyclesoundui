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
};

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Send mail with defined transport object
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'vachuska@ekostat.cz',
      subject: 'Nová zpráva z webu RecycleSound',
      text: `
        Jméno: ${name}
        Email: ${email}
        Telefon: ${phone}
        Zpráva: ${message}
      `,
      html: `
        <h2>Nová zpráva z webu RecycleSound</h2>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
