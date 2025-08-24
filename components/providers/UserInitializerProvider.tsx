import React from "react";
import useUser from "@/hooks/UserHook";
import { ReactNode, useEffect } from "react";

const UserInitializerProvider = ({ children }: { children?: ReactNode }) => {
  const { initializeUser } = useUser();
  useEffect(() => {
    initializeUser();
  }, []);
  return <>{children}</>;
};

export default UserInitializerProvider;
