import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { verifySchema } from "@/types/yupSchema";
import { verifyService } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ROUTES_PATH } from "@/utils/routesPath";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email is required for verification");
      navigate(ROUTES_PATH.AUTH.LOGIN);
    }
  }, [email, navigate]);

  const verifyMutation = useMutation({
    mutationFn: verifyService,
    onSuccess: () => {
      toast.success("Account verified successfully!");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Verification failed");
    },
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verifySchema,
    onSubmit: (values) => {
      if (email) {
        verifyMutation.mutate({
          email,
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
            We've sent a 6-digit OTP to your email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>
              Check your email ({email}) for the verification code
            </CardDescription>
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
                  <p className="text-sm text-destructive">{formik.errors.otp}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!formik.isValid || !formik.dirty || verifyMutation.isPending}
              >
                {verifyMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
