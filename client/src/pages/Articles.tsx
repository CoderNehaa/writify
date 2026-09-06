import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { LeftSidebar, SidebarNav } from "@/components/articles/LeftSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Loader2, Inbox, Menu } from "lucide-react";
import { getArticlesService } from "@/api/article";
import { getCategoriesService } from "@/api/category";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <Inbox className="h-10 w-10 text-muted-foreground" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

const Articles = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "trending";
  const [selectedTab, setSelectedTab] = useState(categoryFromUrl);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Keep the selected tab in sync if the user arrives via a category link
  // (or navigates back/forward) with a different ?category= value.
  useEffect(() => {
    setSelectedTab(categoryFromUrl);
  }, [categoryFromUrl]);

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ["articles", searchTerm],
    queryFn: () => getArticlesService(searchTerm ? { search: searchTerm } : {}),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
  });

  const isLoading = isLoadingArticles;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex w-full">
        <LeftSidebar />

        <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 sm:p-6">
              {/* LeftSidebar's nav is hidden below md — this gives mobile
                  users a way to reach it instead of losing site navigation
                  entirely on small screens. */}
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="mb-4 gap-2 md:hidden">
                    <Menu className="h-4 w-4" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="p-4 pb-0">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && searchTerm ? (
                // Search spans all articles regardless of category — a flat
                // results list reads more naturally than picking a tab first.
                <>
                  <h2 className="text-lg font-semibold mb-6">
                    Search results for &ldquo;{searchTerm}&rdquo;
                  </h2>
                  {articles.length === 0 ? (
                    <EmptyState message={`No articles match "${searchTerm}".`} />
                  ) : (
                    <div className="space-y-4">
                      {articles.map((article) => (
                        <ArticleListItem key={article._id} article={article} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                !isLoading && (
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <div className="overflow-x-auto mb-6">
                      <TabsList className="w-max">
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                        {categories.map((category) => (
                          <TabsTrigger key={category._id} value={category._id}>
                            {category.categoryName}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <TabsContent value="trending" className="mt-0">
                      {articles.length === 0 ? (
                        <EmptyState message="No articles yet. Be the first to write one!" />
                      ) : (
                        <div className="space-y-4">
                          {articles.map((article) => (
                            <ArticleListItem key={article._id} article={article} />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {categories.map((category) => {
                      const categoryArticles = articles.filter(
                        (article) => article.category._id === category._id
                      );
                      return (
                        <TabsContent
                          key={category._id}
                          value={category._id}
                          className="mt-0"
                        >
                          {categoryArticles.length === 0 ? (
                            <EmptyState
                              message={`No articles in ${category.categoryName} yet.`}
                            />
                          ) : (
                            <div className="space-y-4">
                              {categoryArticles.map((article) => (
                                <ArticleListItem key={article._id} article={article} />
                              ))}
                            </div>
                          )}
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Articles;
