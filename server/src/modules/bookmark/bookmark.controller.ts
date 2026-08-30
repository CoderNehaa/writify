// bookmark.controller.ts for bookmark module
import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { BookmarkService } from "./bookmark.service";

export class BookmarkController extends BaseController {
  private bookmarkService: BookmarkService;

  constructor(service: BookmarkService) {
    super();
    this.bookmarkService = service;
  }

  create = async (req: Request, res: Response) => {
    try {
      const data = await this.bookmarkService.create(req.body);
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "create", "BookmarkController");
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.bookmarkService.getAll();
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getAll", "BookmarkController");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.bookmarkService.getById(id);
      if (!data) {
        return this.sendNotFoundResponse(res);
      }
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getById", "BookmarkController");
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.bookmarkService.updateById(String(id), req.body);
      if (!data) {
        return this.sendNotFoundResponse(
          res,
          "bookmark not found or failed to update!"
        );
      }
      return this.sendSuccessResponse(
        res,
        data,
        "Update operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "updateById", "BookmarkController");
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.bookmarkService.deleteById(id);

      return this.sendSuccessResponse(
        res,
        data,
        "Delete operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "deleteById", "BookmarkController");
    }
  };
}
