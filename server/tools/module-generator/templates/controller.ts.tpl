// {{module}}.controller.ts for {{module}} module
import { Request, Response } from "express";
import { BaseController } from "../base/base.controller";
import { {{Module}}Service } from "./{{module}}.service";

export class {{Module}}Controller extends BaseController {
  private {{module}}Service: {{Module}}Service;

  constructor(service: {{Module}}Service) {
    super();
    this.{{module}}Service = service;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.{{module}}Service.getAll();
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getAll", "{{Module}}Controller");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.{{module}}Service.getById(id);
      if (!data) {
        return this.sendNotFoundResponse(res);
      }
      return this.sendSuccessResponse(res, data);
    } catch (e) {
      return this.handleError(res, e, "getById", "{{Module}}Controller");
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.{{module}}Service.updateById(String(id), req.body);
      return this.sendSuccessResponse(res, data, "Update operation completed successfully!");
    } catch (e) {
      return this.handleError(res, e, "updateById", "{{Module}}Controller");
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.{{module}}Service.deleteById(id);

      return this.sendSuccessResponse(res, data, "Delete operation completed successfully!");
    } catch (e) {
      return this.handleError(res, e, "deleteById", "{{Module}}Controller");
    }
  };
}
