import useUser from "@/hooks/UserHook";
import { i18n, useTranslation } from "@/localization";
import { usePathname, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const authPages = [
  "/login",
  "/register",
  "/reset-password-code",
  "/reset-password",
  "/reset-phone-first",
  "/set-new-password",
  "/verify-phone",
];

const ProfileButton = () => {
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const locale = i18n.locale;

  return user ? (
    <Pressable
      onPress={() => {
        router.push("/account");
      }}
    >
      <Avatar alt="User Profile Button">
        <AvatarFallback>
          <Text>
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  ) : (
    <Button
      variant={"outline"}
      onPress={() => {
        if (authPages.includes(pathname)) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      }}
    >
      <Text
        className="text-xs"
        style={{
          fontSize: 12,
          fontFamily: locale == "en" ? "kodchasan" : "cairo",
        }}
      >
        {authPages.includes(pathname) ? t("landing.home") : t("auth.Login")}
      </Text>
    </Button>
  );
};

export default ProfileButton;
