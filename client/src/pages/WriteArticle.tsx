import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Eye, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { RichTextEditor } from "@/components/articles/RichTextEditor";
import { getCategoriesService } from "@/api/category";
import { createArticleService, getArticleByIdService, updateArticleService } from "@/api/article";
import useAuthStore from "@/store/authStore";

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

const WriteArticle = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditing = !!id;
  const { currentUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStatus, setCurrentStatus] = useState<"draft" | "published">("draft");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
  });

  const { data: existingArticle, isLoading: isLoadingArticle } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => (await getArticleByIdService(id as string)).data,
    enabled: isEditing,
  });

  useEffect(() => {
    if (!existingArticle) return;
    if (currentUser && existingArticle.author._id !== currentUser._id) {
      toast.error("You can only edit your own articles.");
      navigate("/profile");
      return;
    }
    setTitle(existingArticle.title);
    setContent(existingArticle.content);
    setCategory(existingArticle.category._id);
    setCoverImagePreview(existingArticle.coverImage || "");
    setCurrentStatus(existingArticle.status);
  }, [existingArticle, currentUser, navigate]);

  const saveMutation = useMutation({
    mutationFn: (status: "draft" | "published") => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("status", status);
      if (coverImageFile) formData.append("coverImage", coverImageFile);
      return isEditing
        ? updateArticleService(id as string, formData)
        : createArticleService(formData);
    },
    onSuccess: (_, status) => {
      toast.success(
        status === "published"
          ? "Article published successfully!"
          : "Draft saved successfully!"
      );
      // The article-detail/list queries now default to a 60s staleTime, so
      // without this an edit lands you back on a view that still serves the
      // pre-edit data straight from cache. Invalidate everything this save
      // could have changed so the pages we might land back on refetch.
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "articles" ||
          query.queryKey[0] === "user-articles" ||
          (query.queryKey[0] === "article" && query.queryKey[1] === id),
      });
      // Editing: return to wherever the user opened this article from
      // (Profile, Article Detail, etc.) instead of a fixed destination.
      // New articles have no meaningful "back" yet, so send those to a
      // sensible default based on status.
      if (isEditing) {
        navigate(-1);
      } else {
        navigate(status === "published" ? "/articles" : "/profile");
      }
    },
  });

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!content.trim()) nextErrors.content = "Content is required.";
    if (!category) nextErrors.category = "Please select a category.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    saveMutation.mutate("published");
  };

  const handleSaveDraft = () => {
    if (!validate()) return;
    saveMutation.mutate("draft");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const selectedCategoryName = categories.find((c) => c._id === category)
    ?.categoryName;

  if (isEditing && isLoadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saveMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {isEditing ? "Edit Article" : "Write New Article"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePublish} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-semibold h-auto py-3"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <input
                    ref={fileInputRef}
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <ImagePlus className="h-4 w-4" />
                      {coverImageFile || coverImagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    {coverImagePreview && (
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="h-16 w-28 object-cover rounded-md border"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor content={content} onChange={setContent} />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={saveMutation.isPending}
                  >
                    {isEditing && currentStatus === "published"
                      ? "Save Changes"
                      : "Publish Article"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || "Untitled article"}</DialogTitle>
          </DialogHeader>
          {selectedCategoryName && (
            <span className="text-sm text-muted-foreground">
              {selectedCategoryName}
            </span>
          )}
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Cover"
              className="w-full rounded-lg max-h-64 object-cover"
            />
          )}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: content || "<p>Nothing to preview yet.</p>",
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WriteArticle;
