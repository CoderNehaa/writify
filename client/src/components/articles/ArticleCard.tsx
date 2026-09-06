import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, User } from "lucide-react";
import { stripHtml, formatArticleDate } from "@/utils/article";

interface ArticleCardProps {
  article: IArticle;
  editHref?: string;
  onDelete?: () => void;
}

export const ArticleCard = ({ article, editHref, onDelete }: ArticleCardProps) => {
  return (
    <Card className="hover-lift shadow-card border-0 bg-gradient-card overflow-hidden group">
      {article.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{article.category.categoryName}</Badge>
          {article.status === "draft" && <Badge variant="outline">Draft</Badge>}
        </div>

        <Link to={`/articles/${article._id}`}>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="text-muted-foreground line-clamp-3 mb-4">
          {stripHtml(article.content)}
        </p>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
        <Link
          to={article.author ? `/profile/${article.author._id}` : "#"}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.author?.avatar} alt={article.author?.fullName} />
            <AvatarFallback>
              {article.author?.fullName?.[0] ?? <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{article.author?.fullName ?? "Deleted user"}</p>
            <p className="text-xs text-muted-foreground">
              {formatArticleDate(article.createdAt)}
            </p>
          </div>
        </Link>

        {(editHref || onDelete) && (
          <div className="flex items-center gap-1">
            {editHref && (
              <Button variant="ghost" size="icon" asChild>
                <Link to={editHref}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
