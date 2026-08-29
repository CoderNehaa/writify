import { createTransport, Transporter } from "nodemailer";
import {
  EMAIL_SENDER_MAIL,
  EMAIL_SENDER_NAME,
  EMAIL_SENDER_PASSWORD,
} from "../config/environment";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_SENDER_MAIL,
        pass: EMAIL_SENDER_PASSWORD,
      },
    });
  }

  sendMail = (
    to: string,
    subject: string,
    body: string,
    html: boolean = false
  ) => {
    const options = {
      from: { name: EMAIL_SENDER_NAME, address: EMAIL_SENDER_MAIL },
      to,
      subject,
      ...(html ? { html: body } : { text: body }),
    };

    this.transporter
      .sendMail(options)
      .then((response: SMTPTransport.SentMessageInfo) => {
        console.info("Sent email, Reference id: ", response.messageId);
      })
      .catch((err: any) => {
        console.error("Email failed to send: ", err);
      });
  };
}
