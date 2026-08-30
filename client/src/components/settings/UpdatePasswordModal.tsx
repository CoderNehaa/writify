import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { useFormik } from "formik";
import { updatePasswordSchema } from "@/constants/yup-validator";
import { toast } from "react-toastify";

const UpdatePasswordModal = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  return (
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
          <DialogDescription>Enter your new password below</DialogDescription>
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
            {passwordFormik.touched.newPassword &&
              passwordFormik.errors.newPassword && (
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
            {passwordFormik.touched.confirmPassword &&
              passwordFormik.errors.confirmPassword && (
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
  );
};

export default UpdatePasswordModal;
