import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { RoleEnum } from "@/enums/RoleEnum";
import useUser from "@/hooks/UserHook";
import { useTranslation } from "@/localization";
import { useRouter } from "expo-router";
import { View } from "react-native";

const AuthHome = () => {
  const { t } = useTranslation();
  const { setSignInRole } = useUser();
  const router = useRouter();
  const onClick = (role: RoleEnum) => {
    setSignInRole(role).then(() => {
      router.replace("/login");
    });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Card className="w-[90%]">
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.welcomeBack")}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{t("auth.signIn")}</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-5">
            <Button
              onPress={() => {
                onClick(RoleEnum.DOCTOR);
              }}
            >
              <Text>{t("auth.sign_as_doctor")}</Text>
            </Button>
            <Button
              variant={"secondary"}
              onPress={() => {
                onClick(RoleEnum.SECRETARY);
              }}
            >
              <Text>{t("auth.sign_as_secretary")}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default AuthHome;
