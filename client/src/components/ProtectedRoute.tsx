import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { ROUTES_PATH } from "@/utils/routesPath";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={ROUTES_PATH.AUTH.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
