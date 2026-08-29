import { BaseService } from "../base/base.service";
import OTPModel, { IOtp } from "./otp.schema";

// otp.service.ts for otp module
export class OTPService extends BaseService<IOtp> {
  constructor() {
    super(OTPModel);
  }

  async generateAndSaveOTP(email: string) {
    const otpNum = Math.floor(100000 + Math.random() * 900000);
    const otp = otpNum.toString();
    await this.model.findOneAndUpdate(
      { email },
      { otp },
      { new: true, upsert: true }
    );
    return otp;
  }
}
