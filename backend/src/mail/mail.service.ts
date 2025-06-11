import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MessageType } from '../types/message.types';

const host = process.env.HOST_MAIL;
const port = parseInt(process.env.PORT_MAIL || '587', 10);
const user = process.env.AUTH_USER_MAIL;
const pass = process.env.AUTH_PASS_MAIL;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  // secure: false,
  // secure: port === 465,
  auth: {
    user: user,
    pass: pass,
  },
  // tls: {
    // ciphers: 'SSLv3',
    // rejectUnauthorized: false,
  // },
} as SMTPTransport.Options);

export const sendEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string,
  sendToMe: boolean = false,
): Promise<MessageType> => {

  const recipient = sendToMe ? user : email;

  const mailOptions = {
    from: user,
    to: recipient,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { label: "emailSent", message: "Email sent", status: true };
  } catch (error) {
    return {
      label: "emailNoSent",
      message: error instanceof Error ? error.message : 'Unknown error',
      status: false,
    };
  }
};