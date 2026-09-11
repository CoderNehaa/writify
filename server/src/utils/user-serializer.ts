import { S3Service } from "../clients/s3.service";

/**
 * Turn a user document (Mongoose doc or plain object) into a safe API
 * payload: strips secrets that must never leave the server, and resolves
 * the private-bucket avatar key into a viewable (presigned) URL.
 *
 * `.toObject()` deliberately does NOT run the schema's `toJSON` transform,
 * so the bcrypt hash is still present here — it must be deleted explicitly.
 */
export const toSafeUser = async (user: any, s3Service: S3Service) => {
  if (!user) return user;
  const plain =
    typeof user?.toObject === "function" ? user.toObject() : { ...user };
  delete plain.password;
  delete plain.__v;
  plain.avatar = await s3Service.resolveUrl(plain.avatar);
  return plain;
};
