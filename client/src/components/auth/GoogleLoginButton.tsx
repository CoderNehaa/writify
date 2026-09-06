import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { googleLoginService } from "@/api/auth";
import useAuthStore from "@/store/authStore";

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: (idToken: string) => googleLoginService(idToken),
    onSuccess: (res) => {
      toast.success(res.message || "Signed in successfully!");
      setCurrentUser(res.data?.user ?? null);
      navigate("/");
    },
  });

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    mutate(credentialResponse.credential);
  };

  return (
    <div className="w-full flex justify-center [&>div]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed. Please try again.")}
        width="100%"
      />
    </div>
  );
};
