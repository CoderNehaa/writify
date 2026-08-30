// article.service.ts for article module
import { BaseService } from "../base/base.service";
import { ArticleModel } from "./article.schema";
import { IArticle } from "./article.type";

export class ArticleService extends BaseService<IArticle> {
  constructor() {
    super(ArticleModel);
  }
}
