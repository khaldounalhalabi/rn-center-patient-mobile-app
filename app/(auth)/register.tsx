import Form from "@/components/form/Form";
import FormDatepicker from "@/components/inputs/FormDatepicker";
import FormInput from "@/components/inputs/FormInput";
import FormRadio from "@/components/inputs/FormRadio";
import FormSelect from "@/components/inputs/FormSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import BloodGroupEnum from "@/enums/BloodGroupEnum";
import GenderEnum from "@/enums/GenderEnum";
import { getEnumValues, setPhone } from "@/helpers/helpers";
import useUser from "@/hooks/UserHook";
import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import { AuthResponse } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, View } from "react-native";

const Register = () => {
  const { setUser } = useUser();
  const [error, setError] = useState(false);
  const service = AuthService.make();
  const router = useRouter();
  const { t } = useTranslation();
  const onSubmit = async (data: any) => {
    setError(false);
    await setPhone(data.phone);
    const response = await service.register(data);
    if (response.notVerified()) {
      router.replace("/verify-phone");
    }
    return response;
  };

  const onSuccess = async (data: ApiResponse<AuthResponse>) => {
    setUser(data?.data?.user);
  };
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: Platform.OS === "ios" ? 100 : 120,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      keyboardDismissMode="interactive"
    >
      <View className="flex-1 items-center justify-center py-8">
        <Card className={"w-[90%]"}>
          <CardHeader>
            <CardTitle>
              <Text>{t("auth.sign_up")}</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              handleSubmit={onSubmit}
              onSuccess={onSuccess}
              buttonText={t("auth.sign_up")}
            >
              <FormInput
                name="first_name"
                label={t("details.first-Name")}
                type="text"
                returnKeyLabel="next"
                textContentType="givenName"
              />
              <FormInput
                name="last_name"
                label={t("details.last-name")}
                type="text"
                returnKeyLabel="next"
                textContentType="familyName"
              />

              <FormRadio
                options={getEnumValues(GenderEnum).map((i) => ({
                  label: t(`types_statuses.${i}` as any),
                  value: i,
                }))}
                name="gender"
                defaultChecked={GenderEnum.MALE}
                label={t("details.gender")}
              />

              <FormDatepicker
                name="birth_date"
                label={t("details.birthDate")}
              />

              <FormSelect
                options={getEnumValues(BloodGroupEnum)}
                name="blood_group"
                label={t("details.blood")}
              />

              <FormInput
                name="phone"
                label={t("auth.phone")}
                type="tel"
                dataDetectorTypes={"phoneNumber"}
                autoComplete="tel-device"
                returnKeyType="next"
                textContentType="telephoneNumber"
              />
              <FormInput
                name="password"
                label={t("auth.password")}
                type="password"
                returnKeyType="next"
                textContentType="newPassword"
              />
              <FormInput
                name="password_confirmation"
                label={t("auth.confirm-password")}
                type="password"
                returnKeyType="send"
                textContentType="newPassword"
              />
              {error && (
                <Text className="my-3 w-full p-2 text-sm text-destructive">
                  {t("auth.err")}.
                </Text>
              )}
            </Form>

            <View className="w-full mt-4 flex flex-row justify-center items-center gap-1 opacity-80">
              <Text>{t("auth.have_an_account")}</Text>
              <Link
                href={"/login"}
                className="text-sm underline hover:underline cursor-pointer text-foreground web:select-text"
              >
                {t("auth.Login")}
              </Link>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
};

export default Register;
