import useUser from "@/hooks/UserHook";
import { Slot, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { setSignInRole, user, signInRole } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (signInRole) {
      if (user) {
        setSignInRole(signInRole).then(() => {
          router.replace("/");
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!signInRole && pathname !== "/role-select") {
      router.replace("/role-select");
    }
  }, []);

  return (
    <Slot
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
