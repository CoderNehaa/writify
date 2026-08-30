// article.controller.ts for article module
import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { ArticleService } from "./article.service";

export class ArticleController extends BaseController {
  private articleService: ArticleService;

  constructor(service: ArticleService) {
    super();
    this.articleService = service;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.articleService.getAll();
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getAll", "ArticleController");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.articleService.getById(id);
      if (!data) {
        return this.sendNotFoundResponse(res);
      }
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getById", "ArticleController");
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.articleService.updateById(String(id), req.body);
      if (!data) {
        return this.sendNotFoundResponse(
          res,
          "article not found or failed to update!"
        );
      }
      return this.sendSuccessResponse(res, data, "Update operation completed successfully!");
    } catch (e) {
      return this.handleError(res, e, "updateById", "ArticleController");
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.articleService.deleteById(id);

      return this.sendSuccessResponse(res, data, "Delete operation completed successfully!");
    } catch (e) {
      return this.handleError(res, e, "deleteById", "ArticleController");
    }
  };
}
