import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { EmailService } from "../../clients/email.service";
import { CONTACT_EMAIL } from "../../constants/email";
import { EMAIL_SENDER_MAIL } from "../../config/environment";

export class ContactController extends BaseController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  sendMessage = async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;
      this.emailService.sendMail(
        EMAIL_SENDER_MAIL,
        CONTACT_EMAIL.SUBJECT(name),
        CONTACT_EMAIL.BODY(name, email, message)
      );
      return this.sendSuccessResponse(res, null, "Message sent successfully!");
    } catch (e) {
      return this.handleError(res, e, "sendMessage", "ContactController");
    }
  };
}
