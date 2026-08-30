// bookmark.service.ts for bookmark module
import { BaseService } from "../base/base.service";
import { BookmarkModel } from "./bookmark.schema";
import { IBookmark } from "./bookmark.type";

export class BookmarkService extends BaseService<IBookmark> {
  constructor() {
    super(BookmarkModel);
  }
}
