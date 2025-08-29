"use client";
import { setUser } from "@/helpers/helpers";
import { User } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import { createContext, useCallback, useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";

export const UserContext = createContext<{
  user: User | undefined;
  setUser: (newUser: User | undefined) => void;
  initializeUser: () => Promise<User | undefined> | undefined;
  initialized: boolean;
} | null>(null);

const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, updateUser] = useState<User | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const service = AuthService.make();
  
  const fillUser = useCallback((newUser: User | undefined) => {
    if (newUser) {
      setUser(newUser);
      updateUser(newUser);
    } else {
      setUser(undefined);
      updateUser(undefined);
    }
  }, []);

  const initializeUser = useCallback(async () => {
    setIsInitialized(false);
    const res = await service.userDetails();
    if (res.ok()) {
      fillUser(res.data);
      await setUser(res.data);
    }
    return res.data;
  }, [fillUser, service]);
  useEffect(() => {
    initializeUser().then(() => {
      setIsInitialized(true);
    });
  }, [initializeUser]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: fillUser,
        initializeUser: initializeUser,
        initialized: isInitialized,
      }}
    >
      {!isInitialized ? <LoadingScreen /> : children}
    </UserContext.Provider>
  );
};

export default UserProvider;
