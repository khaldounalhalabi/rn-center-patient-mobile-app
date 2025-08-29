import useUser from "@/hooks/UserHook";
import React, { ReactNode, useEffect } from "react";

const UserInitializerProvider = ({ children }: { children?: ReactNode }) => {
  const { initializeUser } = useUser();
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);
  return <>{children}</>;
};

export default UserInitializerProvider;
