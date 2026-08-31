import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { ROUTES_PATH } from "@/utils/routesPath";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileService } from "@/api/user";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, setCurrentUser } = useAuthStore();
  const { data: res, isLoading, isFetching, isError } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: () => getProfileService(),
    retry: false,
  });

  useEffect(() => {
    if (res?.data) {
      setCurrentUser(res.data);
    }
  }, [res, setCurrentUser]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser && (isError || !res?.data)) {
    return <Navigate to={ROUTES_PATH.AUTH.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
