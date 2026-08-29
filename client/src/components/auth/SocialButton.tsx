import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export const SocialButton = ({
  provider,
  icon,
}: {
  provider: string;
  icon: React.ReactNode;
}) => {
  const handleSocialLogin = () => {
    // TODO: Implement OAuth    
    toast.info(`${provider} login will be implemented with Lovable Cloud`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleSocialLogin}
    >
      {icon}
      Continue with {provider}
    </Button>
  );
};
