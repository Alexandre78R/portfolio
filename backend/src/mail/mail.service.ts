import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const host = process.env.HOST_MAIL;
const port = parseInt(process.env.PORT_MAIL || '587', 10);
const user = process.env.AUTH_USER_MAIL;
const pass = process.env.AUTH_PASS_MAIL;
const from = process.env.FROM_MAIL;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
} as SMTPTransport.Options);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: from,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
};