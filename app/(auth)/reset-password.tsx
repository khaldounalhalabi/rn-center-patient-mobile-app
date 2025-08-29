import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/localization";
import { AuthService } from "@/services/AuthService";
import { View } from "react-native";

const ResetPassword = () => {
  const { t } = useTranslation();
  const service = AuthService.make();
  const handleSubmit = (data: { phone: string }) => {
    return service.passwordResetRequest(data.phone);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Card className="w-[90%]">
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.resetPassword")}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{t("auth.enter_your_phone")}</Text>
          </CardDescription>
          <CardContent>
            <Form handleSubmit={handleSubmit}>
              <FormInput
                name="phone"
                type="tel"
                autoComplete="tel-device"
                dataDetectorTypes={"phoneNumber"}
                label={t("auth.phone")}
              />
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </View>
  );
};

export default ResetPassword;
