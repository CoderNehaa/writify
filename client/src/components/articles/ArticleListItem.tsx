import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { stripHtml, formatArticleDate, categoryGradientClass } from "@/utils/article";

interface ArticleListItemProps {
  article: IArticle;
}

export const ArticleListItem = ({ article }: ArticleListItemProps) => {
  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 transition-colors hover:bg-secondary hover:border-foreground/15">
      <div className="flex gap-4 sm:gap-6">
        {/* min-w-0 is required here — without it, a flex child sizes to
            its content's natural width before line-clamp gets a chance to
            wrap it, so the "2 lines" below was rendering as one long line
            clipped early instead of actually wrapping to 2. */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{article.category.categoryName}</Badge>
          </div>

          <Link to={`/articles/${article._id}`}>
            <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {stripHtml(article.content)}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={article.author ? `/profile/${article.author._id}` : "#"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author?.avatar} alt={article.author?.fullName} />
                <AvatarFallback>
                  {article.author?.fullName?.[0] ?? <User className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {article.author?.fullName ?? "Deleted user"}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatArticleDate(article.createdAt)}
            </span>
          </div>
        </div>

        <Link
          to={`/articles/${article._id}`}
          className="hidden sm:block flex-shrink-0"
        >
          <div className="w-52 h-32 overflow-hidden rounded-xl border">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className={`w-full h-full ${categoryGradientClass(
                  article.category?.categoryName
                )}`}
              />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};
