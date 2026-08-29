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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import { useFormik } from "formik";
import * as Yup from "yup";

const updatePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(8, "Password must not exceed 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const Settings = () => {
  const [username, setUsername] = useState("sarahjohnson");
  const [bio, setBio] = useState(
    "Full-stack developer passionate about web technologies."
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser } = useAuthStore();

  const passwordFormik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordSchema,
    onSubmit: (values, { resetForm }) => {
      // TODO: Implement actual password change
      toast.success("Password updated successfully!");
      setIsPasswordModalOpen(false);
      resetForm();
    },
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual profile update
    toast.success("Profile updated successfully!");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account with confirmation dialog
    toast.error("Account deletion will be implemented");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

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
                  <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your new password below
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={passwordFormik.values.newPassword}
                              onChange={passwordFormik.handleChange}
                              onBlur={passwordFormik.handleBlur}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                            <p className="text-sm text-destructive">
                              {passwordFormik.errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={passwordFormik.values.confirmPassword}
                              onChange={passwordFormik.handleChange}
                              onBlur={passwordFormik.handleBlur}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                              {passwordFormik.errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsPasswordModalOpen(false);
                              passwordFormik.resetForm();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={!passwordFormik.isValid || !passwordFormik.dirty}
                          >
                            Update Password
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex items-center gap-4">
                    {currentUser.avatar ? (
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={currentUser.avatar}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {currentUser.name}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="border-gray-500 border-4 p-2 rounded-full">
                        <User size={42} className="text-gray-500" />
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Click to upload new avatar
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <Button type="submit" variant="default">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator />

            {/* Delete Account Section */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
