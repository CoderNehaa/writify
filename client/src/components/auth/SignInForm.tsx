import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/types/yupSchema";
import { SocialButton } from "./SocialButton";
import GoogleIcon from "@/icons/Google";
import FacebookIcon from "@/icons/Facebook";
import { useMutation } from "@tanstack/react-query";
import { signinService } from "@/api/auth";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ISignInPayload) => signinService(data),
    onSuccess: (res) => {
      setCurrentUser(res.data);
      toast.success("Signed in successfully!");
      navigate("/");
    },
  });

  const signInFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit: (values) => mutate(values),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={signInFormik.handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <SocialButton provider="Google" icon={<GoogleIcon />} />
            <SocialButton provider="Facebook" icon={<FacebookIcon />} />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="name@example.com"
              {...signInFormik.getFieldProps("email")}
            />
            {signInFormik.touched.email && signInFormik.errors.email && (
              <p className="text-sm text-destructive">
                {signInFormik.errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <div className="relative">
              <Input
                id="signin-password"
                type={showSignInPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                {...signInFormik.getFieldProps("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
              >
                {showSignInPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {signInFormik.touched.password && signInFormik.errors.password && (
              <p className="text-sm text-destructive">
                {signInFormik.errors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="hero"
            disabled={!signInFormik.isValid || !signInFormik.dirty || isPending}
          >
            Sign In
          </Button>
          <div className="text-center">
            <Button type="button" variant="link" size="sm">
              Forgot password?
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
