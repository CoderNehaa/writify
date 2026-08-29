import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
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
}
