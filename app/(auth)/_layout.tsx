import useUser from "@/hooks/UserHook";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user && user.phone_verified_at) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <Slot
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
