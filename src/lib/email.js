import nodemailer from 'nodemailer';

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

export async function sendEmail({ to, subject, html }) {
  const smtp = getSmtpConfig();
  if (!smtp) {
    console.warn('[sendEmail] SMTP not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.');
    return { success: false, error: new Error('SMTP not configured') };
  }

  const from = process.env.SMTP_FROM || smtp.auth.user;
  const transporter = nodemailer.createTransport(smtp);

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[sendEmail] Error sending email:', error);
    return { success: false, error };
  }
}

