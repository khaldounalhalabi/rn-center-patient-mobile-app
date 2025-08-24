import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { useTranslation } from "@/localization";
import { AuthService } from "@/services/AuthService";
import { View } from "react-native";

const SetNewPassword = () => {
  const { signInRole } = useUser();
  const service = AuthService.make(signInRole);
  const { t } = useTranslation();
  const handleSubmit = (data: {
    password: string;
    password_confirmation: string;
  }) => {
    return service.resetPassword(data.password, data.password_confirmation);
  };

  return (
    <View className="flex-1 w-full items-center justify-center">
      <Card className="w-[90%]">
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.resetPassword")}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form handleSubmit={handleSubmit}>
            <FormInput
              name="password"
              type="password"
              autoComplete="new-password"
              label={t("auth.password")}
            />
            <FormInput
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              label={t("auth.confirm-password")}
              placeholder={t("details.confirm-password")}
            />
          </Form>
        </CardContent>
      </Card>
    </View>
  );
};

export default SetNewPassword;
