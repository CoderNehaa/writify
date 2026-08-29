import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock, Lock } from "lucide-react";

interface ArticleListItemProps {
  article: IArticle;
}

export const ArticleListItem = ({ article }: ArticleListItemProps) => {
  return (
    <div className="hover-lift p-4 rounded-lg border bg-card transition-all duration-300">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{article.category.name}</Badge>
            {article.isPaid && (
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>

          <Link to={`/articles/${article.id}`}>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {article.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <Link
              to={`/profile/${article.author.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{article.author.name}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{article.commentsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {article.coverImage && (
          <Link to={`/articles/${article.id}`} className="flex-shrink-0">
            <div className="w-40 h-32 overflow-hidden rounded-lg">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
