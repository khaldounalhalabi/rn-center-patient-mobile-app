import Page from "@/components/page";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { useTranslation } from "@/localization";
import { useRouter } from "expo-router";
import { View } from "react-native";

const Details = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Page>
      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.first-Name")}</Text>
        <Badge>
          <Text>{user?.first_name}</Text>
        </Badge>
      </View>

      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.last-name")}</Text>
        <Badge>
          <Text>{user?.last_name}</Text>
        </Badge>
      </View>

      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.gender")}</Text>
        <Badge>
          <Text>
            <TranslatableEnum value={user?.gender} />
          </Text>
        </Badge>
      </View>

      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.phone")}</Text>
        <Badge>
          <Text>{user?.phone}</Text>
        </Badge>
      </View>

      <Button
        className="w-full"
        onPress={() => {
          router.push("/account/edit");
        }}
      >
        <Text>{t("details.editBtn")}</Text>
      </Button>
    </Page>
  );
};

export default Details;
