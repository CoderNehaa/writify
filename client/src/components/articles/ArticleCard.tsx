import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock, Lock } from "lucide-react";

interface ArticleCardProps {
  article: IArticle;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
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
          <Badge variant="secondary">{article.category.name}</Badge>
          {article.isPaid && (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>

        <Link to={`/articles/${article.id}`}>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="text-muted-foreground line-clamp-3 mb-4">
          {article.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
        <Link
          to={`/profile/${article.author.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.author.avatar} alt={article.author.name} />
            <AvatarFallback>{article.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{article.author.name}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{article.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{article.commentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{article.readTime} min</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
