// category.controller.ts for category module
import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { CategoryService } from "./category.service";

export class CategoryController extends BaseController {
  private categoryService: CategoryService;

  constructor(service: CategoryService) {
    super();
    this.categoryService = service;
  }

  create = async (req: Request, res: Response) => {
    try {
      const data = await this.categoryService.updateAndUpsert(
        { categoryName: req.body.categoryName },
        req.body
      );
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "create", "CategoryController");
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.categoryService.getAll();
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getAll", "CategoryController");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.categoryService.getById(id);
      if (!data) {
        return this.sendNotFoundResponse(res);
      }
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getById", "CategoryController");
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.categoryService.updateById(String(id), req.body);
      if (!data) {
        return this.sendNotFoundResponse(
          res,
          "Category not found or failed to update!"
        );
      }
      return this.sendSuccessResponse(
        res,
        data,
        "Update operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "updateById", "CategoryController");
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.categoryService.deleteById(id);

      return this.sendSuccessResponse(
        res,
        data,
        "Delete operation completed successfully!"
      );
    } catch (e) {
      return this.handleError(res, e, "deleteById", "CategoryController");
    }
  };
}
