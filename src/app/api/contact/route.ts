import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"Zurriya Website" <${process.env.GMAIL_USER}>`,
      to: 'zurriyacdc@gmail.com',
      replyTo: email,
      subject: `New Consultation Request — ${name}`,
      text: [
        `Name:    ${name}`,
        `Phone:   ${phone || 'Not provided'}`,
        `Email:   ${email}`,
        ``,
        `Message:`,
        message,
      ].join('\n'),
      html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
  <div style="background:#1B5E6E;padding:24px 32px;border-radius:12px 12px 0 0;">
    <h1 style="color:white;margin:0;font-size:20px;font-weight:600;">New Consultation Request</h1>
    <p style="color:rgba(255,255,255,0.65);margin:6px 0 0;font-size:14px;">Via zurriya.com contact form</p>
  </div>
  <div style="background:#f9f7f4;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e0d8;border-top:none;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;width:28%;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#999;">Name</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;font-size:15px;">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#999;">Phone</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;font-size:15px;">${phone || '—'}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#999;">Email</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e0d8;font-size:15px;">
          <a href="mailto:${email}" style="color:#1B5E6E;text-decoration:none;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0 4px;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#999;">Message</span>
        </td>
        <td style="padding:12px 0 4px;font-size:15px;line-height:1.65;">
          ${message.replace(/\n/g, '<br>')}
        </td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:14px 18px;background:#e0eeeb;border-radius:8px;border-left:3px solid #1B5E6E;">
      <p style="margin:0;font-size:13px;color:#1B5E6E;">
        <strong>To reply:</strong> Hit reply in your email client — it goes directly to ${email}
      </p>
    </div>
  </div>
</div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] email error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
