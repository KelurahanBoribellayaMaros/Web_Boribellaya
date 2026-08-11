import "server-only";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  return "https://kel-boribellaya.maroskab.go.id";
}

// A plain-text alternative alongside the HTML body makes the message a
// proper multipart email, which spam filters treat as more legitimate than
// HTML-only mail — derived automatically so call sites only write HTML once.
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h[1-6])>/gi, "\n")
    .replace(/<li>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  await getTransporter().sendMail({
    from: `"Kelurahan Boribellaya" <${process.env.GMAIL_USER}>`,
    // Lets the sending account be a dedicated "robot" address (never read
    // by staff) while citizen replies still land in an inbox someone
    // actually checks. Falls back to the sender itself if unset.
    replyTo: process.env.EMAIL_REPLY_TO || process.env.GMAIL_USER,
    to,
    subject,
    html,
    text: htmlToText(html),
  });
}
