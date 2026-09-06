import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { ReadStream } from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from "../config/environment";
import logger from "../utils/logger";

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucket = AWS_S3_BUCKET_NAME;
  }

  /**
   * Upload file
   */
  async uploadFile(
    fileContent: Buffer | ReadStream,
    key: string,
    contentType: string
  ): Promise<S3Response> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      const url = this.getPublicUrl(key);
      return { success: true, url, key };
    } catch (error) {
      logger.error("Error uploading file:", error);
      return { success: false, error };
    }
  }

  /**
   * Delete File
   */
  async deleteFile(key: string): Promise<S3Response> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return { success: true, key };
    } catch (error) {
      logger.error("Error deleting file:", error);
      return { success: false, error };
    }
  }

  /**
   * Generate public URL
   */
  getPublicUrl(key: string): string {
    return `https://s3.${AWS_REGION}.amazonaws.com/${this.bucket}/${key}`;
  }

  /**
   * Extract key from presigned URL
   */
  extractKeyFromPresignedUrl(presignedUrl: string): string | null {
    try {
      const url = new URL(presignedUrl);
      const pathParts = url.pathname.split("/");
      pathParts.shift(); // remove empty string

      return pathParts.slice(1).join("/");
    } catch (error) {
      logger.error("Error extracting key:", error);
      return null;
    }
  }

  /**
   * Generate Presigned Upload URL
   */
  async generatePreSignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: "video/mp4",
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 10 * 60, // 10 minutes
    });
  }

  /**
   * Generate a time-limited presigned URL to read a private object —
   * used instead of making the bucket/objects public.
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresInSeconds = 24 * 60 * 60 // 24h: long enough that most browsing
    // sessions never see it expire, short enough to stay "temporary".
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  /**
   * Turn a stored avatar/coverImage value into something the browser can
   * actually load: pass external URLs through unchanged (e.g. a Google
   * account's profile picture, or a legacy public S3 URL from before this
   * bucket went private), and presign anything else as an S3 key.
   */
  async resolveUrl(value?: string | null): Promise<string | undefined> {
    if (!value) return value ?? undefined;
    if (/^https?:\/\//i.test(value)) return value;
    return this.getPresignedDownloadUrl(value);
  }
}
