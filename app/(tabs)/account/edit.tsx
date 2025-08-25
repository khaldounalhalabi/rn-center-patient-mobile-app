import Form from "@/components/form/Form";
import FormInput from "@/components/inputs/FormInput";
import FormRadio from "@/components/inputs/FormRadio";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/page";
import { useTranslateEnum } from "@/components/TranslatableEnum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import GenderEnum from "@/enums/GenderEnum";
import { getEnumValues } from "@/helpers/helpers";
import useUser from "@/hooks/UserHook";
import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import { User } from "@/models/User";
import { AuthService } from "@/services/AuthService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const Edit = () => {
  const { t } = useTranslation();
  const translateEnum = useTranslateEnum();
  const { setUser, user: storedUser } = useUser();
  const service = AuthService.make();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user_data"],
    queryFn: async () => service.me(),
    select(data) {
      return data.data;
    },
  });
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    return await service.updateUserDetails(data).then((res) => {
      if (res.ok()) {
        if (storedUser?.phone != res.data?.user?.phone) {
          service.logout().then(() => {
            router.replace("/verify-phone");
          });
        } else {
          setUser(res.data.user);
        }
      }
      refetch();
      return res;
    });
  };

  const onSuccess = (res: ApiResponse<User>) => {
    if (res.ok()) {
      router.replace("/account/details");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Page>
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>{t("details.edit_account_details")}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            handleSubmit={handleSubmit}
            onSuccess={onSuccess}
            defaultValues={user}
          >
            <FormInput
              name={"first_name"}
              type={"text"}
              label={t("details.first-Name")}
            />
            <FormInput
              name={"last_name"}
              type={"text"}
              label={t("details.last-name")}
            />
            <FormInput
              name={"phone"}
              type={"tel"}
              label={t("auth.phone")}
              dataDetectorTypes={"phoneNumber"}
              autoComplete="tel-device"
            />

            <FormRadio
              name="gender"
              label={t("details.gender")}
              options={getEnumValues(GenderEnum).map((i) => ({
                label: translateEnum(i),
                value: i,
              }))}
            />
            <View className="w-full">
              <UpdatePasswordDialog user={user} />
            </View>
          </Form>
        </CardContent>
      </Card>
    </Page>
  );
};

export default Edit;

const UpdatePasswordDialog = ({ user }: { user?: User }) => {
  const service = AuthService.make(user?.role);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const onSubmit = async (data: any) => {
    return service.updateUserDetails(data);
  };

  const onSuccess = async () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        <Button variant={"outline"} className="w-full">
          <Text>{t("details.resetPassword")}</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[75%] w-full">
        <DialogHeader>
          <DialogTitle>{t("details.resetPassword")}</DialogTitle>
        </DialogHeader>
        <Form handleSubmit={onSubmit} onSuccess={onSuccess}>
          <FormInput
            type="password"
            label={t("auth.password")}
            name="password"
            autoComplete="new-password"
          />

          <FormInput
            type="password"
            label={t("auth.confirm-password")}
            name="password_confirmation"
            autoComplete="new-password"
            returnKeyType={"done"}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};
