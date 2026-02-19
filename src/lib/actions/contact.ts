"use server";

import { Resend } from "resend";
import { sanityWriteClient } from "../../../sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactState {
  success?: boolean;
  error?: string;
}

export async function submitContact(
  _prevState: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const budget = formData.get("budget") as string;

  if (!name || !email || !message) {
    return { error: "required fields missing" };
  }

  try {
    // 1. Send notification email via Resend
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
      await resend.emails.send({
        from: process.env.CONTACT_EMAIL_FROM ?? "noreply@resend.dev",
        to: process.env.CONTACT_EMAIL_TO,
        subject: `Yeni Mesaj: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="font-weight: 500; margin-bottom: 24px;">Yeni İletişim Mesajı</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; opacity: 0.5; width: 120px;">Ad Soyad</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; opacity: 0.5;">E-posta</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${budget ? `<tr><td style="padding: 8px 0; opacity: 0.5;">Bütçe</td><td style="padding: 8px 0;">${budget}</td></tr>` : ""}
              <tr>
                <td style="padding: 8px 0; opacity: 0.5; vertical-align: top;">Mesaj</td>
                <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
        `,
      });
    }

    // 2. Save to Sanity
    if (process.env.SANITY_API_WRITE_TOKEN) {
      await sanityWriteClient.create({
        _type: "contactSubmission",
        name,
        email,
        message,
        budget: budget || undefined,
        receivedAt: new Date().toISOString(),
        isRead: false,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { error: "submission failed" };
  }
}
