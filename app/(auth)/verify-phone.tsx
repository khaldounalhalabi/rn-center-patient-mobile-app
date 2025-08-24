import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import { AuthResponse } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import { useState } from "react";
import { View } from "react-native";
const VerifyPhone = () => {
  const { signInRole, role, setUser } = useUser();
  const service = AuthService.make(signInRole ?? role);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: any) => {
    return await service.verifyPhone(data.verification_code);
  };

  const onSuccess = async (data: ApiResponse<AuthResponse>) => {
    setUser(data?.data?.user);
  };

  const resendVerificationCode = async () => {
    setLoading(true);
    await service.resendVerificationCode();
    setLoading(false);
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Card className={"w-[90%]"}>
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.verify_phone")}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            handleSubmit={onSubmit}
            onSuccess={onSuccess}
            buttonText={t("auth.verify")}
          >
            <FormInput
              name="verification_code"
              label={t("auth.verification_code")}
              type="text"
              autoComplete="sms-otp"
              returnKeyType="next"
            />
          </Form>

          <View className="w-full mt-4 flex flex-row justify-center items-center gap-1 opacity-80">
            <Button
              onPress={resendVerificationCode}
              variant={"outline"}
              className="flex flex-row items-center gap-3"
            >
              <Text>{t("auth.resend_verification_code")}</Text>
              {loading && <LoadingSpinner />}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default VerifyPhone;
