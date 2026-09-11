import { randomInt } from "crypto";
import { BaseService } from "../base/base.service";
import OTPModel, { IOtp } from "./otp.schema";

// otp.service.ts for otp module
export class OTPService extends BaseService<IOtp> {
  constructor() {
    super(OTPModel);
  }

  async generateAndSaveOTP(email: string) {
    // Cryptographically secure — Math.random() is predictable.
    const otp = randomInt(100000, 1000000).toString();
    await this.model.findOneAndUpdate(
      { email },
      { otp },
      { new: true, upsert: true }
    );
    return otp;
  }
}
