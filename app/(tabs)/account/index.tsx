import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { Calendar, PowerOff, User2Icon } from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const service = AuthService.make();
  const { t } = useTranslation();
  const { setUser } = useUser();
  const logout = async () => {
    setUser(undefined);
    await service.logout();
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex flex-col px-3">
          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/account/details");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("admin.users.userDetails")}</Text>
              <User2Icon className="text-primary" />
            </View>
          </Pressable>
          <Pressable
            className="w-full"
            onPress={() => {
              router.replace("/appointments");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("links.appointments")}</Text>
              <Calendar className="text-primary" />
            </View>
          </Pressable>
          <Pressable className="w-full" onPress={logout}>
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("nav.logout")}</Text>
              <PowerOff className="text-primary" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
