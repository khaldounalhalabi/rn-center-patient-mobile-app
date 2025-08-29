import useUser from "@/hooks/UserHook";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { user, initialized } = useUser();
  useEffect(() => {
    if (user && !user.phone_verified_at && initialized) {
      router.replace("/verify-phone");
    }
  }, [user, initialized, router]);
  return <>{children}</>;
};

export default AuthProvider;
