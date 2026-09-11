import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  EMAIL_SENDER_MAIL,
  EMAIL_SENDER_NAME,
} from "../config/environment";
import logger from "../utils/logger";

export class EmailService {
  private client: SESv2Client;

  constructor() {
    this.client = new SESv2Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // Fire-and-forget by design (callers don't await): a failed send is logged,
  // never thrown, so it can't take down the request that triggered it.
  sendMail = async (
    to: string,
    subject: string,
    body: string,
    html: boolean = false
  ): Promise<void> => {
    const command = new SendEmailCommand({
      FromEmailAddress: `${EMAIL_SENDER_NAME} <${EMAIL_SENDER_MAIL}>`,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: html
            ? { Html: { Data: body, Charset: "UTF-8" } }
            : { Text: { Data: body, Charset: "UTF-8" } },
        },
      },
    });

    try {
      const res = await this.client.send(command);
      logger.info(`Sent email to ${to}, Reference id: ${res.MessageId}`);
    } catch (err) {
      logger.error("Email failed to send: ", err);
    }
  };
}
