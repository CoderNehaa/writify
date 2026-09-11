// article.controller.ts for article module
import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { BaseController } from "../base/base.controller";
import { S3Service } from "../../clients/s3.service";
import { ArticleService } from "./article.service";
import { EArticleStatus } from "./article.type";

const sanitizeContent = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
    },
  });

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "article";

export class ArticleController extends BaseController {
  private articleService: ArticleService;
  private s3Service: S3Service;

  constructor(service: ArticleService, s3Service: S3Service) {
    super();
    this.articleService = service;
    this.s3Service = s3Service;
  }

  // Returns the S3 *key*, not a public URL — the bucket is private, so
  // callers must resolve it to a viewable (presigned) URL before it's ever
  // sent to a client. See `serializeArticle`.
  private async uploadCoverImage(
    req: Request,
    titleForKey: string
  ): Promise<string | null> {
    const coverImageFile =
      Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null;
    if (!coverImageFile) return null;

    const ext = coverImageFile.originalname.split(".").pop();
    const key = `article/${slugify(titleForKey)}-${Date.now()}.${ext}`;
    const uploadResult = await this.s3Service.uploadFile(
      coverImageFile.buffer,
      key,
      coverImageFile.mimetype
    );
    return uploadResult.success ? key : null;
  }

  private async serializeArticle(article: any) {
    const plain =
      typeof article?.toObject === "function" ? article.toObject() : { ...article };
    plain.coverImage = await this.s3Service.resolveUrl(plain.coverImage);
    if (plain.author && typeof plain.author === "object" && "avatar" in plain.author) {
      plain.author.avatar = await this.s3Service.resolveUrl(plain.author.avatar);
    }
    return plain;
  }

  private serializeArticles(articles: any[]) {
    return Promise.all(articles.map((article) => this.serializeArticle(article)));
  }

  create = async (req: Request, res: Response) => {
    try {
      const coverImageKey = await this.uploadCoverImage(req, req.body.title);
      const data = await this.articleService.create({
        title: req.body.title,
        content: sanitizeContent(req.body.content),
        category: req.body.category,
        status: req.body.status || EArticleStatus.DRAFT,
        author: req.user._id,
        ...(coverImageKey ? { coverImage: coverImageKey } : {}),
      });
      return this.sendSuccessResponse(
        res,
        await this.serializeArticle(data),
        "Article created successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "create", "ArticleController");
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const { category, author, search } = req.query as {
        category?: string;
        author?: string;
        search?: string;
      };
      // req.user is only set when a valid session was presented (optionalAuth).
      const isOwnArticles = !!author && author === String(req.user?._id);

      const data = await this.articleService.getAllFiltered({
        category,
        author,
        search,
        // Only the author can list their own drafts; everyone else only sees published articles.
        status: isOwnArticles ? undefined : EArticleStatus.PUBLISHED,
      });
      return this.sendSuccessResponse(res, await this.serializeArticles(data));
    } catch (e) {
      return this.handleError(res, e, "getAll", "ArticleController");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.articleService.getByIdPopulated(String(id));
      if (!data) {
        return this.sendNotFoundResponse(res);
      }
      const authorId = (data.author as any)?._id ?? data.author;
      // Drafts are visible only to their author; anonymous callers (no
      // req.user) never match, so they get a 404 for anything unpublished.
      if (
        data.status !== EArticleStatus.PUBLISHED &&
        String(authorId) !== String(req.user?._id)
      ) {
        return this.sendNotFoundResponse(res);
      }
      return this.sendSuccessResponse(res, await this.serializeArticle(data));
    } catch (e) {
      return this.handleError(res, e, "getById", "ArticleController");
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = await this.articleService.getById(String(id));
      if (!existing) {
        return this.sendNotFoundResponse(res);
      }
      if (String(existing.author) !== String(req.user._id)) {
        return this.sendBadRequestResponse(
          res,
          "You are not allowed to edit this article",
          403
        );
      }

      const coverImageKey = await this.uploadCoverImage(
        req,
        req.body.title || existing.title
      );
      const updateBody: Record<string, unknown> = { ...req.body };
      if (updateBody.content) {
        updateBody.content = sanitizeContent(String(updateBody.content));
      }
      if (coverImageKey) {
        updateBody.coverImage = coverImageKey;
      }

      const data = await this.articleService.updateById(String(id), updateBody);
      return this.sendSuccessResponse(
        res,
        data && (await this.serializeArticle(data)),
        "Update operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "updateById", "ArticleController");
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = await this.articleService.getById(String(id));
      if (!existing) {
        return this.sendNotFoundResponse(res);
      }
      if (String(existing.author) !== String(req.user._id)) {
        return this.sendBadRequestResponse(
          res,
          "You are not allowed to delete this article",
          403
        );
      }

      const data = await this.articleService.deleteById(String(id));
      return this.sendSuccessResponse(
        res,
        data,
        "Delete operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "deleteById", "ArticleController");
    }
  };
}
