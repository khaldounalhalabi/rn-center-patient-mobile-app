import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { setPhone } from "@/helpers/helpers";
import { useTranslation } from "@/localization";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "expo-router";
import { View } from "react-native";

const ResetPhoneFirst = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const service = AuthService.make();
  const onSubmit = async (data: any) => {
    await setPhone(data.phone);
    return await service.resendVerificationCode();
  };

  const onSuccess = async () => {
    router.replace("/verify-phone");
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Card className={"w-[90%]"}>
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.what_is_your_phone")}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            handleSubmit={onSubmit}
            buttonText={t("auth.resend_verification_code")}
            onSuccess={onSuccess}
          >
            <FormInput
              name="phone"
              label={t("auth.phone")}
              type="tel"
              dataDetectorTypes={"phoneNumber"}
              autoComplete="tel-device"
            />
          </Form>
        </CardContent>
      </Card>
    </View>
  );
};

export default ResetPhoneFirst;
