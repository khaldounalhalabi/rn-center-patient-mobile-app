"use client";
import { UserContext } from "@/components/providers/UserProvider";
import { useContext } from "react";

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Cannot Use User Hook Outside Of User Provider", {
      cause:
        "This is caused because you are using the user hook in a component that isn't wrapped with the UserProvider component , of for some reason the UserContext is still null at this point",
    });
  }

  return {
    user: context?.user,
    setUser: context?.setUser,
    permissions: context?.user?.permissions,
    initializeUser: context.initializeUser,
    initialized: context.initialized,
  };
};

export default useUser;
