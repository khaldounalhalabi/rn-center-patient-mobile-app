import useUser from "@/hooks/UserHook";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { user, initialized } = useUser();
  useEffect(() => {
    if (!user && initialized) {
      router.replace("/role-select");
    }
  }, [user, initialized]);
  return <>{children}</>;
};

export default AuthProvider;
