import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { verifyAccountService } from "@/api/auth";
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
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ROUTES_PATH } from "@/utils/routesPath";
import useAuthStore from "@/store/authStore";
import { verifyOTPSchema } from "@/constants/yup-validator";

const Verify = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();
  const [signupData, setSignupData] = useState({
    email: "",
    message: "",
  });

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("signupResponse"));
    if (!temp.email && !temp.message) {
      toast.error("Email is required for verification");
      navigate(ROUTES_PATH.AUTH.LOGIN);
    }
    setSignupData({
      email: temp.email,
      message: temp.message,
    });
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: verifyAccountService,
    onSuccess: (res: IResponse<IUser>) => {
      toast.success(res.message);
      navigate("/");
      setCurrentUser(res.data);
      localStorage.clear();
    },
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verifyOTPSchema,
    onSubmit: (values) => {
      if (signupData.email) {
        mutate({
          email: signupData.email,
          otp: values.otp,
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Account</h1>
          <p className="text-muted-foreground">
            {" "}
            Check your email for the verification code
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>{signupData.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.otp && formik.errors.otp
                      ? "border-destructive"
                      : ""
                  }
                />
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-sm text-destructive">
                    {formik.errors.otp}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!formik.isValid || !formik.dirty || isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate(ROUTES_PATH.AUTH.LOGIN)}
                className="text-sm"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
