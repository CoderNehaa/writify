import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { ROUTES_PATH } from "@/utils/routesPath";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userProfileService } from "@/api/user";

const ProtectedRoute = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuthStore();
  const {
    data: res,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["current-user-profile", currentUser?._id || ""],
    queryFn: () => userProfileService(),
  });

  useEffect(() => {
    if (!currentUser && res.data) {
      setCurrentUser(res.data);
    }
  }, [currentUser]);

  // If no user → redirect to /auth
  if (!currentUser && !isLoading && !isFetching && !res.data) {
    return <Navigate to={ROUTES_PATH.AUTH.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
