import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleCard } from "@/components/articles/ArticleCard";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { FileText, User } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByIdService } from "@/api/user";
import { deleteArticleService, getArticlesService } from "@/api/article";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser } = useAuthStore();
  const userId = useParams().userId || currentUser?._id || "";
  const isOwnProfile = currentUser?._id === userId;
  const queryClient = useQueryClient();
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (currentUser?._id === userId) {
        return currentUser;
      }
      const res = await getUserByIdService(userId);
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["user-articles", userId],
    queryFn: () => getArticlesService({ author: userId }),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId: string) => deleteArticleService(articleId),
    onSuccess: (res) => {
      toast.success(res.message || "Article deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
      setArticleToDelete(null);
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {user.avatar ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="text-2xl">
                      {user.fullName}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="border-gray-500 border-4 p-2 rounded-full">
                    <User size={42} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-3xl font-semibold mb-1">{user.fullName}</h1>
                  <p className="text-primary mb-2">@{user.username}</p>
                  <p className="text-muted-foreground mb-4">{user.bio}</p>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-serif text-lg font-semibold">{articles.length}</span>{" "}
                      <span className="text-muted-foreground">Articles</span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to="/settings">Edit Profile</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold mb-6">
                <FileText className="h-4 w-4 text-primary" />
                Articles
              </h2>
              {articles.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <p className="text-muted-foreground">No articles posted yet.</p>
                  {isOwnProfile && (
                    <Button asChild>
                      <Link to="/write">Write Article</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      editHref={isOwnProfile ? `/write/${article._id}` : undefined}
                      onDelete={
                        isOwnProfile ? () => setArticleToDelete(article._id) : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        text="This will permanently delete this article. Do you want to proceed?"
        open={!!articleToDelete}
        onCancel={() => setArticleToDelete(null)}
        onConfirm={() => articleToDelete && deleteMutation.mutate(articleToDelete)}
      />

      <Footer />
    </div>
  );
};

export default Profile;
