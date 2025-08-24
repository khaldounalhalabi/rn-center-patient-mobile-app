"use client";
import { RoleEnum } from "@/enums/RoleEnum";
import { setRole, setUser } from "@/helpers/helpers";
import { User } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";

export const UserContext = createContext<{
  user: User | undefined;
  setUser: (newUser: User | undefined) => void;
  role?: RoleEnum;
  initializeUser: () => Promise<User | undefined> | undefined;
  initialized: boolean;
  signInRole?: RoleEnum;
  setSignInRole: (role: RoleEnum) => Promise<void>;
} | null>(null);

const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, updateUser] = useState<User | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const [role, updateRole] = useState<RoleEnum | undefined>(undefined);
  const [signRole, updateSignInRole] = useState<RoleEnum | undefined>(
    undefined,
  );

  useEffect(() => {
    initializeUser().then(() => {
      setIsInitialized(true);
    });

    AsyncStorage.getItem("login_role").then((data) => {
      updateSignInRole((data as RoleEnum) ?? undefined);
    });
  }, []);

  useEffect(() => {
    setRole(user?.role ?? RoleEnum.PUBLIC);
    updateRole(user?.role ?? RoleEnum.PUBLIC);
  }, [user]);

  const fillUser = useCallback((newUser: User | undefined) => {
    if (newUser) {
      setRole(newUser?.role ?? RoleEnum.PUBLIC);
      updateRole(newUser?.role ?? RoleEnum.PUBLIC);
      setUser(newUser);
      updateUser(newUser);
    } else {
      setUser(undefined);
      updateUser(undefined);
    }
  }, []);

  const initializeUser = async () => {
    const res = await AuthService.make().me();
    fillUser(res.data);
    await setUser(res.data);
    return res.data;
  };

  const setSignInRole = async (role: RoleEnum): Promise<void> => {
    const prev = isInitialized;
    setIsInitialized(false);
    await AsyncStorage.setItem("login_role", role);
    updateSignInRole(role);
    setIsInitialized(prev);
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: fillUser,
        role: role,
        initializeUser: initializeUser,
        initialized: isInitialized,
        signInRole: signRole,
        setSignInRole: setSignInRole,
      }}
    >
      {!isInitialized ? <LoadingScreen /> : children}
    </UserContext.Provider>
  );
};

export default UserProvider;
