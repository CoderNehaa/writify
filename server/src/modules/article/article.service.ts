// article.service.ts for article module
import { BaseService } from "../base/base.service";
import { ArticleModel } from "./article.schema";
import { EArticleStatus, IArticle } from "./article.type";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface IArticleListFilters {
  category?: string;
  author?: string;
  status?: EArticleStatus;
  search?: string;
}

export class ArticleService extends BaseService<IArticle> {
  constructor() {
    super(ArticleModel);
  }

  async getAllFiltered(filters: IArticleListFilters): Promise<IArticle[]> {
    const query: Record<string, unknown> = {};
    if (filters.category) query.category = filters.category;
    if (filters.author) query.author = filters.author;
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.title = { $regex: escapeRegex(filters.search), $options: "i" };
    }

    return this.model
      .find(query)
      .populate("author", "fullName username avatar")
      .populate("category", "categoryName")
      .sort({ createdAt: -1 });
  }

  async getByIdPopulated(id: string): Promise<IArticle | null> {
    return this.model
      .findById(id)
      .populate("author", "fullName username avatar")
      .populate("category", "categoryName");
  }

  async deleteAllByAuthor(authorId: string): Promise<void> {
    await this.model.deleteMany({ author: authorId });
  }
}
