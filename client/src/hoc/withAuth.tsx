"use client";
import { getProfileService } from "@/api/user";
import useAuthStore from "@/store/authStore";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthComponent(props: any) {
    const { currentUser, setCurrentUser } = useAuthStore();

    const getUser = async () => {
      const res = await getProfileService();
      if (res && res.success) {
        setCurrentUser(res.data);
      } else {
        toast.info("Your session has expired! Login again");
        window.location.href = "/";
      }
    };

    useEffect(() => {
      if (!currentUser) {
        getUser();
      }
    }, [currentUser]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
