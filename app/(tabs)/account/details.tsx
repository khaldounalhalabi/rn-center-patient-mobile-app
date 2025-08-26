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
        <Text> {t("details.birthDate")}</Text>
        <Badge>
          <Text>{user?.customer?.birth_date}</Text>
        </Badge>
      </View>

      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.blood")}</Text>
        <Badge>
          <Text>{user?.customer?.blood_group}</Text>
        </Badge>
      </View>

      <View className="flex flex-row items-center justify-between w-full">
        <Text> {t("details.age")}</Text>
        <Badge>
          <Text>{user?.customer?.age}</Text>
        </Badge>
      </View>

      <View className="flex items-start justify-between gap-3 w-full">
        <Text> {t("common.patient.create.healthStatus")}</Text>
        <Badge>
          <Text>
            {user?.customer?.health_status ?? (
              <TranslatableEnum value="no_data" />
            )}
          </Text>
        </Badge>
      </View>

      <View className="flex items-start gap-3 justify-between w-full">
        <Text> {t("details.birthDate")}</Text>
        <Badge>
          <Text>
            {user?.customer?.notes ?? <TranslatableEnum value="no_data" />}
          </Text>
        </Badge>
      </View>

      {user?.customer?.other_data?.map((item, index) => (
        <View className="flex items-start gap-3 justify-between w-full" key={index}>
          <Text className="font-bold">{item.key}</Text>
          <Text>{item.value ?? <TranslatableEnum value="no_data" />}</Text>
        </View>
      ))}

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
