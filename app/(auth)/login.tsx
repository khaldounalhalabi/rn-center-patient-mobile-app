import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { RoleEnum } from "@/enums/RoleEnum";
import { setPhone } from "@/helpers/helpers";
import useUser from "@/hooks/UserHook";
import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import { AuthResponse } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const Login = () => {
  const { signInRole, setUser } = useUser();
  const [error, setError] = useState(false);
  const service = AuthService.make(signInRole);
  const router = useRouter();
  const { t } = useTranslation();
  const onSubmit = async (data: any) => {
    setError(false);
    await setPhone(data.phone);
    const response = await service.login(data.phone, data.password);
    if (response.isNotAuthorized()) {
      setError(true);
    }

    if (response.notVerified()) {
      router.replace("/verify-phone");
    }
    return response;
  };

  const onSuccess = async (data: ApiResponse<AuthResponse>) => {
    setUser(data?.data?.user);
    router.navigate("/");
  };
  return (
    <View className="flex-1 items-center justify-center ">
      <Card className={"w-[90%]"}>
        <CardHeader>
          <CardTitle>
            <Text>{t("auth.Login")}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            handleSubmit={onSubmit}
            onSuccess={onSuccess}
            buttonText={t("auth.Login")}
          >
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
              returnKeyType="send"
            />
            {error && (
              <Text className="my-3 w-full p-2 text-sm text-destructive">
                {t("auth.err")}.
              </Text>
            )}
          </Form>

          <View className="w-full mt-4 flex flex-row justify-center items-center gap-1 opacity-80">
            <Text>{t("auth.forgetPassword")}</Text>
            <Link
              href={"/reset-password"}
              className="text-sm underline hover:underline cursor-pointer text-foreground web:select-text"
            >
              {t("auth.resetPassword")}
            </Link>
          </View>
          <View className="w-full mt-4 flex flex-row justify-center items-center gap-1 opacity-80">
            <Link
              href={"/role-select"}
              className="text-sm underline hover:underline cursor-pointer text-foreground web:select-text"
            >
              {t("auth.change_user_type", {
                user_type:
                  signInRole == RoleEnum.SECRETARY
                    ? t("types_statuses.doctor")
                    : t("types_statuses.secretary"),
              })}
            </Link>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default Login;
