// backend/src/utils/email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function broadcastTemplate({ title, body, recipientName }) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1B5FE8; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Purwadhika Career Network</h1>
      </div>
      <div style="background: white; padding: 24px; border: 1px solid #E5E8F0;">
        <p style="color: #637085;">Halo, ${recipientName}!</p>
        <h2 style="color: #1E2A3B;">${title}</h2>
        <p style="color: #637085; line-height: 1.6;">${body}</p>
        <a href="${process.env.FRONTEND_URL}"
           style="background: #1B5FE8; color: white; padding: 10px 20px;
                  border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Buka Platform
        </a>
      </div>
      <p style="text-align: center; color: #98A3B5; font-size: 12px; padding: 16px;">
        Purwadhika Career Network &mdash; purwadhika-cn.com
      </p>
    </div>
  `;
}

async function sendEmail({ to, toName, subject, title, body: bodyText }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Purwadhika CN <onboarding@resend.dev>",
      to: [to],
      subject,
      html: broadcastTemplate({ title, body: bodyText, recipientName: toName }),
    });

    if (error) throw new Error(error.message);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email error:", err.message);
    return { success: false, error: err.message };
  }
}

async function sendBroadcastEmails({
  recipients,
  subject,
  title,
  body: bodyText,
}) {
  const results = await Promise.allSettled(
    recipients.map((r) =>
      sendEmail({
        to: r.email,
        toName: r.name,
        subject,
        title,
        body: bodyText,
      }),
    ),
  );

  const success = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;
  const failed = results.length - success;

  return { success, failed, total: results.length };
}

module.exports = { sendEmail, sendBroadcastEmails };
