import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Loader2, Pencil, Trash2, User } from "lucide-react";
import { toast } from "react-toastify";
import { deleteArticleService, getArticleByIdService } from "@/api/article";
import { formatArticleDate } from "@/utils/article";
import useAuthStore from "@/store/authStore";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => (await getArticleByIdService(id as string)).data,
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteArticleService(id as string),
    onSuccess: (res) => {
      toast.success(res.message || "Article deleted successfully!");
      navigate("/profile");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Article not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthor = !!article.author && currentUser?._id === article.author._id;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <article className="container max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <Badge variant="secondary">{article.category.categoryName}</Badge>
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/write/${article._id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full rounded-lg mb-6 object-cover max-h-[420px]"
              />
            )}

            <Link
              to={article.author ? `/profile/${article.author._id}` : "#"}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author?.avatar} alt={article.author?.fullName} />
                <AvatarFallback>
                  {article.author?.fullName?.[0] ?? <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{article.author?.fullName ?? "Deleted user"}</p>
                <p className="text-sm text-muted-foreground">
                  {formatArticleDate(article.createdAt)}
                </p>
              </div>
            </Link>
          </div>

          <div
            className="article-content prose prose-lg max-w-none mt-8 mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      <ConfirmationModal
        text="This will permanently delete this article. Do you want to proceed?"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate()}
      />

      <Footer />
    </div>
  );
};

export default ArticleDetail;
