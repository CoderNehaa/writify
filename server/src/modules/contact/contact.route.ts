import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { contactController } from "../container";
import { ContactValidator } from "./contact.validator";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware";

const contactRouter = Router();
const { validateEndpoint } = BaseValidator;
const { sendMessageValidator } = ContactValidator;

/**
 * @openapi
 * /contact:
 *   post:
 *     summary: Send a message via the contact form
 *     tags: [Contact]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               message: { type: string }
 *     responses:
 *       200: { description: Message emailed successfully }
 */
contactRouter.post(
  "/",
  authRateLimiter,
  validateEndpoint(sendMessageValidator),
  contactController.sendMessage
);

export default contactRouter;
