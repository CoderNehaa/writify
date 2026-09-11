import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, User, X } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import UpdatePasswordModal from "@/components/settings/UpdatePasswordModal";
import { Form, Formik } from "formik";
import { updateAccountSchema } from "@/constants/yup-validator";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATH } from "@/utils/routesPath";
import { deleteUserService, updateUserByIdService } from "@/api/user";

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuthStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteArticlesToo, setDeleteArticlesToo] = useState(false);
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: () => deleteUserService(deleteArticlesToo),
    onSuccess: (res) => {
      toast.success(res.message || "Account deleted successfully!");
      setCurrentUser(null);
      navigate(ROUTES_PATH.AUTH.LOGIN);
    },
  });

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationFn: (payload: FormData) => updateUserByIdService(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Account updated successfully!");
      if (res.data) setCurrentUser(res.data);
      navigate("/profile");
    },
  });

  // For image preview and upload
  const [previewImage, setPreviewImage] = useState(currentUser?.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Hidden file input ref
  let fileInputRef: HTMLInputElement | null = null;

  // Handle file change
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    setSelectedFile(() => file);
    setPreviewImage(url);
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleProfileSubmit = async (values: IUpdateForm) => {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("bio", values.bio);

      if (selectedFile) {
        formData.append("profile", selectedFile);
      }

      await updateMutate(formData);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-semibold mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Update Account Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Update Account</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </div>
                  <UpdatePasswordModal />
                </div>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={{
                    bio: currentUser.bio,
                    username: currentUser.username,
                    fullName: currentUser.fullName,
                  }}
                  validationSchema={updateAccountSchema}
                  onSubmit={handleProfileSubmit}
                  enableReinitialize={true}
                >
                  {({ values, handleChange, resetForm }) => (
                    <Form className="space-y-6 mt-4">
                      {" "}
                      {/* Avatar Section */}
                      <div className="relative w-fit">
                        {previewImage ? (
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={previewImage} />
                            <AvatarFallback>
                              {values?.username?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="border-gray-500 border-4 p-2 rounded-full">
                            <User size={42} className="text-gray-500" />
                          </div>
                        )}

                        {/* Pencil Icon */}
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-secondary border border-border text-foreground p-1.5 rounded-full shadow-sm hover:border-foreground/30"
                          onClick={() => fileInputRef?.click()}
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Cross Icon */}
                        {previewImage && (
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-secondary border border-border text-foreground p-1.5 rounded-full shadow-sm hover:border-foreground/30"
                            onClick={handleRemoveImage}
                          >
                            <X size={14} />
                          </button>
                        )}

                        <input
                          type="file"
                          hidden
                          ref={(ref) => (fileInputRef = ref)}
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={values.username}
                          onChange={handleChange("username")}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={values.fullName}
                          onChange={handleChange("fullName")}
                          placeholder="Enter Full Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={values.bio}
                          onChange={handleChange("bio")}
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" variant="default" disabled={updatePending}>
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={updatePending}
                          onClick={() => {
                            resetForm();
                            setSelectedFile(null);
                            setPreviewImage(currentUser?.avatar || null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>

            <Separator />

            {/* Delete Account Section */}
            <Card className="border-destructive/40 bg-destructive/5">
              <CardHeader>
                <CardTitle className="font-sans text-xl text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    disabled={deletePending}
                    onClick={() => setDeleteModalVisible(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Dialog
              open={deleteModalVisible}
              onOpenChange={(open) => {
                setDeleteModalVisible(open);
                if (!open) setDeleteArticlesToo(false);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete your account?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  This action is permanent and cannot be undone.
                </p>
                <div className="flex items-start gap-2 rounded-md border p-3">
                  <Checkbox
                    id="delete-articles-too"
                    checked={deleteArticlesToo}
                    onCheckedChange={(checked) => setDeleteArticlesToo(checked === true)}
                  />
                  <Label htmlFor="delete-articles-too" className="font-normal leading-snug">
                    Also permanently delete all my articles. If left unchecked, your
                    published articles will remain visible, attributed to a deleted
                    account.
                  </Label>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModalVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={deletePending}
                    onClick={() => deleteMutate()}
                  >
                    {deleteArticlesToo
                      ? "Delete account and articles"
                      : "Delete account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
