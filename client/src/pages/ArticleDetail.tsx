import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Download,
  Flag,
  Clock,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";

const ArticleDetail = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sharesRemaining, setSharesRemaining] = useState(3); // Mock free user with 3 shares left

  // Mock data - TODO: Replace with actual API call
  const article = {
    id: "1",
    title: "Getting Started with React and TypeScript",
    description: "Learn how to build type-safe React applications using TypeScript.",
    content: `
      <p>React and TypeScript together provide a powerful combination for building robust web applications. In this comprehensive guide, we'll explore how to set up and use TypeScript with React effectively.</p>
      
      <h2>Why TypeScript with React?</h2>
      <p>TypeScript adds static typing to JavaScript, which helps catch errors early in development and provides better IDE support. When combined with React, it creates a development experience that's both productive and reliable.</p>
      
      <h2>Getting Started</h2>
      <p>To begin using TypeScript with React, you'll need to set up your project correctly. The easiest way is to use Create React App with the TypeScript template...</p>
    `,
    author: {
      id: "1",
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Full-stack developer passionate about web technologies",
      followersCount: 1250,
      followingCount: 340,
      articlesCount: 45,
      isFollowing: false,
    },
    category: { id: "1", name: "Technology", slug: "technology" },
    tags: ["react", "typescript", "webdev"],
    isPaid: false,
    likes: 234,
    commentsCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
    readTime: 8,
  };

  const isPremiumUser = false; // Mock - TODO: Get from auth context

  const handleLike = () => {
    if (!isPremiumUser) {
      toast.error("Please sign in to like articles");
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  const handleShare = () => {
    if (!isPremiumUser && sharesRemaining === 0) {
      toast.error("You've reached your monthly share limit. Upgrade to share unlimited articles.");
      return;
    }
    // TODO: Implement share functionality
    if (!isPremiumUser) {
      setSharesRemaining(prev => prev - 1);
    }
    toast.success("Article link copied to clipboard!");
  };

  const handleBookmark = () => {
    if (!isPremiumUser) {
      toast.error("Bookmarks are a premium feature. Upgrade to bookmark articles.");
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleDownload = () => {
    if (!isPremiumUser) {
      toast.error("PDF downloads are a premium feature. Upgrade to download articles.");
      return;
    }
    toast.success("Downloading PDF...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <article className="container max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{article.category.name}</Badge>
              {article.isPaid && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{article.description}</p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                to={`/profile/${article.author.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{article.author.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime} min read</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>

              <Button variant="outline">Follow</Button>
            </div>
          </div>

          <div className="flex items-center gap-2 py-4 border-y sticky top-16 bg-background/95 backdrop-blur z-40">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{article.likes + (isLiked ? 1 : 0)}</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
              <span>{article.commentsCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              {!isPremiumUser && <span className="text-xs ml-1">({sharesRemaining}/5)</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? "text-primary" : ""}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          <div className="article-content prose prose-lg max-w-none mt-8 mb-12">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                #{tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Comments ({article.commentsCount})</h2>
            <p className="text-muted-foreground">Sign in to leave a comment</p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
