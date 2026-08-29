import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Hash, Bookmark } from "lucide-react";

interface RightSidebarProps {
  recommendedTopics?: string[];
  savedArticles?: IArticle[];
}

// Mock data
const mockTopics = [
  "React",
  "TypeScript",
  "Web Development",
  "Remote Work",
  "Mindfulness",
];

const mockSavedArticles: IArticle[] = [
  {
    id: "1",
    title: "Getting Started with React",
    description: "Learn React basics",
    content: "",
    author: {
      id: "1",
      name: "Sarah",
      username: "sarah",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      followersCount: 100,
      followingCount: 50,
      articlesCount: 10,
    },
    category: { id: "1", name: "Tech", slug: "tech", articleCount: 100 },
    tags: ["react"],
    isPaid: false,
    likes: 50,
    commentsCount: 10,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    readTime: 5,
  },
];

export const RightSidebar = ({ 
  recommendedTopics = mockTopics,
  savedArticles = mockSavedArticles 
}: RightSidebarProps) => {
  return (
    <div className="w-80 border-l bg-card h-screen sticky top-0">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Recommended Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Saved Articles</h3>
            </div>
            <div className="space-y-4">
              {savedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="block p-3 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all"
                >
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.author.name}</span>
                    <span>{article.readTime} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
