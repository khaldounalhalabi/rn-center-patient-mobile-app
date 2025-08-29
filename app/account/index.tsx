import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useFileDownload from "@/hooks/useFileDownload";
import useUser from "@/hooks/UserHook";
import {
  Archive,
  BookCheck,
  Calendar,
  DownloadIcon,
  FileStack,
  PowerOff,
  User2Icon,
} from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const service = AuthService.make();
  const { t } = useTranslation();
  const { setUser } = useUser();
  const logout = async () => {
    setUser(undefined);
    await service.logout();
  };
  const { downloadFile, isDownloading } = useFileDownload();

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex flex-col px-3">
          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/account/details");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("admin.users.userDetails")}</Text>
              <User2Icon className="text-primary" />
            </View>
          </Pressable>
          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/appointments");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("links.appointments")}</Text>
              <Calendar className="text-primary" />
            </View>
          </Pressable>

          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/prescriptions");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("links.prescriptions")}</Text>
              <BookCheck className="text-primary" />
            </View>
          </Pressable>
          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/medical-records");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("medical_records.index_title")}</Text>
              <Archive className="text-primary" />
            </View>
          </Pressable>
          <Pressable
            className="w-full"
            onPress={() => {
              router.push("/attachments");
            }}
          >
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("common.patient.attachments.title")}</Text>
              <FileStack className="text-primary" />
            </View>
          </Pressable>
          <Pressable className="w-full" onPress={logout}>
            <View className="w-full flex flex-row items-center justify-between p-5 border-b border-b-secondary">
              <Text>{t("nav.logout")}</Text>
              <PowerOff className="text-primary" />
            </View>
          </Pressable>

          <Button
            className="my-5 flex flex-row gap-3"
            onPress={() => {
              downloadFile(
                "customer/me/to-pdf",
                "Medical Report.pdf",
                "application/pdf",
              );
            }}
          >
            <Text style={{ fontSize: 12 }}>
              {t("patient_app.download_pdf_report")}
            </Text>
            {isDownloading ? (
              <LoadingSpinner className="text-primary-foreground" />
            ) : (
              <DownloadIcon className="text-primary-foreground" />
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
