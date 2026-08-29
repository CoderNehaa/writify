import mongoose, { Document, Schema } from "mongoose";
import { COLLECTION_NAMES } from "../../constants/collections";

// interface
export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt?: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const OTPModel = mongoose.model(COLLECTION_NAMES.OTP, otpSchema);
export default OTPModel;
