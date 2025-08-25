import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { View } from "react-native";

const ResetPasswordCode = () => {
  const [loading, setLoading] = useState(false);
  const service = AuthService.make();
  const { t } = useTranslation();

  const handleResetButton = async () => {
    setLoading(true);
    await service.resendResetPasswordCode();
    setLoading(false);
    toast.success(t("components.success"));
  };

  const handleSubmit = async (data: any) => {
    return service.checkResetCode(data.code);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Card className="w-[90%]">
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.resetPasswordCode")}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{t("auth.enterResetPasswordCode")}</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form handleSubmit={handleSubmit}>
            <FormInput
              name="code"
              type="tel"
              label={t("auth.code")}
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
            />

            <Button
              variant={"secondary"}
              className="w-full flex flex-row gap-3 items-center"
              onPress={handleResetButton}
            >
              <Text>{t("auth.resendThecode")}</Text>
              {loading && (
                <LoadingSpinner className="text-secondary-foreground" />
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </View>
  );
};

export default ResetPasswordCode;
