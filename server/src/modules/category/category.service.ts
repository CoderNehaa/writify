// category.service.ts for category module
import { BaseService } from "../base/base.service";
import { CategoryModel } from "./category.schema";
import { ICategory } from "./category.type";

export class CategoryService extends BaseService<ICategory> {
  constructor() {
    super(CategoryModel);
  }
}
