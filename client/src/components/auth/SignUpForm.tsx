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
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { signUpSchema } from "@/types/yupSchema";
import { SocialButton } from "./SocialButton";
import GoogleIcon from "@/icons/Google";
import FacebookIcon from "@/icons/Facebook";
import { useMutation } from "@tanstack/react-query";
import { checkUsernameService, signupService } from "@/api/auth";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { ROUTES_PATH } from "@/utils/routesPath";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ISignUpPayload) => signupService(data),
    onSuccess: (res) => {
      toast.success(res.data.message);
      navigate(ROUTES_PATH.AUTH.VERIFY);
    },
  });

  const { mutate: checkUsername, isPending: checkingUsername } = useMutation({
    mutationFn: async (username: string) => checkUsernameService(username),
    onSuccess: (isAvailable: boolean) => {
      setUsernameAvailable(isAvailable);
    },
  });

  const signUpFormik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) =>
      mutate({
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        password: values.password,
      }),
  });

  function handleUsernameInput(e) {
    const username = e.target.value;
    signUpFormik.setFieldValue("username", username);

    if (username.length >= 3 && username.length <= 8) {
      debouncedCheck(username);
    }
  }

  const debouncedCheck = useDebouncedCallback((username) => {
    checkUsername(username);
  }, 600); // 600ms debounce

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Start your writing journey today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={signUpFormik.handleSubmit} className="space-y-4">
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
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              placeholder="John Doe"
              {...signUpFormik.getFieldProps("fullName")}
            />
            {signUpFormik.touched.fullName && signUpFormik.errors.fullName && (
              <p className="text-sm text-destructive">
                {signUpFormik.errors.fullName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-username">Username</Label>
            <div className="relative">
              <Input
                id="signup-username"
                placeholder="johndoe"
                className="pr-10"
                onChange={handleUsernameInput}
                // {...signUpFormik.getFieldProps("username")}
              />
              <div className="absolute right-0 top-0 h-full px-3 flex items-center">
                {checkingUsername && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {signUpFormik.touched.username && signUpFormik.errors.username && (
              <p className="text-sm text-destructive">
                {signUpFormik.errors.username}
              </p>
            )}
            {usernameAvailable === false && !signUpFormik.errors.username && (
              <p className="text-sm text-destructive">
                Username is already taken
              </p>
            )}
            {usernameAvailable === true && !signUpFormik.errors.username && (
              <p className="text-sm text-green-600">Username is available</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              {...signUpFormik.getFieldProps("email")}
            />
            {signUpFormik.touched.email && signUpFormik.errors.email && (
              <p className="text-sm text-destructive">
                {signUpFormik.errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                {...signUpFormik.getFieldProps("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {signUpFormik.touched.password && signUpFormik.errors.password && (
              <p className="text-sm text-destructive">
                {signUpFormik.errors.password}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pr-10"
                {...signUpFormik.getFieldProps("confirmPassword")}
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
            {signUpFormik.touched.confirmPassword &&
              signUpFormik.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {signUpFormik.errors.confirmPassword}
                </p>
              )}
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="hero"
            disabled={
              !signUpFormik.isValid ||
              !signUpFormik.dirty ||
              usernameAvailable !== true ||
              isPending
            }
          >
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
