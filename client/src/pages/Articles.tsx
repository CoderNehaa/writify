import { useState } from "react";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { LeftSidebar } from "@/components/articles/LeftSidebar";
import { RightSidebar } from "@/components/articles/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const categories = [
  { id: "1", name: "Technology", slug: "technology" },
  { id: "2", name: "Business", slug: "business" },
  { id: "3", name: "Lifestyle", slug: "lifestyle" },
  { id: "4", name: "Education", slug: "education" },
  { id: "5", name: "Health", slug: "health" },
  { id: "6", name: "Travel", slug: "travel" },
];

// Mock data
const mockArticles: IArticle[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    description: "Learn how to build type-safe React applications using TypeScript. This comprehensive guide covers everything from setup to advanced patterns.",
    content: "",
    author: {
      id: "1",
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      followersCount: 1250,
      followingCount: 340,
      articlesCount: 45,
    },
    category: { id: "1", name: "Technology", slug: "technology", articleCount: 1250 },
    tags: ["react", "typescript", "webdev"],
    isPaid: false,
    likes: 234,
    commentsCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
  },
  {
    id: "2",
    title: "The Future of Remote Work: Trends to Watch",
    description: "Explore the evolving landscape of remote work and discover the key trends shaping the future of how we work.",
    content: "",
    author: {
      id: "2",
      name: "Michael Chen",
      username: "mchen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      followersCount: 890,
      followingCount: 210,
      articlesCount: 32,
    },
    category: { id: "2", name: "Business", slug: "business", articleCount: 850 },
    tags: ["remote", "work", "productivity"],
    isPaid: true,
    coinPrice: 50,
    likes: 567,
    commentsCount: 89,
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    readTime: 12,
  },
  {
    id: "3",
    title: "Mindfulness in the Digital Age",
    description: "Discover practical techniques to maintain mental wellness while navigating our always-connected world.",
    content: "",
    author: {
      id: "3",
      name: "Emma Williams",
      username: "emmaw",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      followersCount: 2100,
      followingCount: 450,
      articlesCount: 78,
    },
    category: { id: "3", name: "Lifestyle", slug: "lifestyle", articleCount: 620 },
    tags: ["mindfulness", "wellness", "mentalhealth"],
    isPaid: false,
    likes: 892,
    commentsCount: 134,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    readTime: 6,
  },
];

const Articles = () => {
  const [selectedTab, setSelectedTab] = useState("trending");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual API call and infinite scroll
  const articles = mockArticles;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        {/* Left Sidebar - Navigation & Following */}
        <LeftSidebar />

        {/* Center Section - Articles List */}
        <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category.slug} value={category.slug}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="trending" className="mt-0">
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                </TabsContent>

                {categories.map((category) => (
                  <TabsContent key={category.slug} value={category.slug} className="mt-0">
                    <div className="space-y-4">
                      {articles
                        .filter((article) => article.category.slug === category.slug)
                        .map((article) => (
                          <ArticleListItem key={article.id} article={article} />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && articles.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Sidebar - Topics & Saved */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Articles;
