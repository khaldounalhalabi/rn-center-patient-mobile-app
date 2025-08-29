import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import {
  Bell,
  Building2,
  Calendar,
  Clock,
  FileText,
  LogIn,
  Paperclip,
  Pill,
  Stethoscope,
  UserPlus,
} from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import { NotificationPayload } from "@/models/NotificationPayload";
import { AppointmentService } from "@/services/AppointmentService";
import AttachmentService from "@/services/AttachmentService";
import MedicalRecordService from "@/services/MedicalRecordService";
import { NotificationService } from "@/services/NotificationService";
import { PrescriptionService } from "@/services/PrescriptionsServise";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user, initialized } = useUser();
  const router = useRouter();

  // Fetch data for authenticated users
  const { data: appointmentsData } = useQuery({
    queryKey: ["home_appointments"],
    queryFn: async () => {
      if (!user) return null;
      const service = AppointmentService.make();
      return service.indexWithPagination(
        1,
        "",
        undefined,
        undefined,
        undefined,
        {},
      );
    },
    enabled: !!user,
    select(data) {
      return data?.data ?? [];
    },
  });

  const { data: medicalRecordsData } = useQuery({
    queryKey: ["home_medical_records"],
    queryFn: async () => {
      if (!user) return null;
      const service = MedicalRecordService.make();
      return service.indexWithPagination(
        1,
        "",
        undefined,
        undefined,
        undefined,
        {},
      );
    },
    enabled: !!user,
    select(data) {
      return data?.data ?? [];
    },
  });

  const { data: prescriptionsData } = useQuery({
    queryKey: ["home_prescriptions"],
    queryFn: async () => {
      if (!user) return null;
      const service = PrescriptionService.make();
      return service.indexWithPagination(
        1,
        "",
        undefined,
        undefined,
        undefined,
        {},
      );
    },
    enabled: !!user,
    select(data) {
      return data?.data ?? [];
    },
  });

  const { data: attachmentsData } = useQuery({
    queryKey: ["home_attachments"],
    queryFn: async () => {
      if (!user) return null;
      const service = AttachmentService.make();
      return service.indexWithPagination(
        1,
        "",
        undefined,
        undefined,
        undefined,
        {},
      );
    },
    enabled: !!user,
    select(data) {
      return data?.data ?? [];
    },
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["home_notifications"],
    queryFn: async () => {
      if (!user) return null;
      const service = NotificationService.make();
      return service.indexWithPagination(
        1,
        "",
        undefined,
        undefined,
        undefined,
        {},
      );
    },
    enabled: !!user,
    select(data) {
      return data?.data ?? [];
    },
  });

  const QuickActionCard = ({
    title,
    icon: Icon,
    onPress,
    count,
    color = "bg-primary",
  }: {
    title: string;
    icon: any;
    onPress: () => void;
    count?: number;
    color?: string;
  }) => (
    <Card className="flex-1 mx-1">
      <CardContent className="p-4 items-center">
        <View className={`p-3 rounded-full ${color} mb-2`}>
          <Icon size={24} color="white" />
        </View>
        <Text className="text-sm font-medium text-center mb-1">{title}</Text>
        {count !== undefined && (
          <Text className="text-xs text-muted-foreground">{count} items</Text>
        )}
      </CardContent>
    </Card>
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "bg-blue-500",
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
  }) => (
    <Card className="flex-1 mx-1">
      <CardContent className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className={`p-2 rounded-full ${color}`}>
            <Icon size={20} color="white" />
          </View>
        </View>
        <Text className="text-2xl font-bold mb-1">{value}</Text>
        <Text className="text-sm text-muted-foreground">{title}</Text>
      </CardContent>
    </Card>
  );

  if (!initialized) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text>{t("components.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold mb-2">
            {user ? t("common.dashboard.welcomeBack") : t("landing.home")}
          </Text>
          {user && (
            <Text className="text-lg text-muted-foreground">
              {user.first_name} {user.last_name}
            </Text>
          )}
        </View>

        {user ? (
          // Authenticated User Content
          <>
            {/* Quick Stats */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("common.dashboard.dashBoard")}
              </Text>
              <View className="flex-row">
                <StatCard
                  title={t("common.appointment.table.appointments")}
                  value={appointmentsData?.length || 0}
                  icon={Calendar}
                  color="bg-green-500"
                />
                <StatCard
                  title={t("medical_records.index_title")}
                  value={medicalRecordsData?.length || 0}
                  icon={FileText}
                  color="bg-blue-500"
                />
                <StatCard
                  title={t("links.prescriptions")}
                  value={prescriptionsData?.length || 0}
                  icon={Pill}
                  color="bg-purple-500"
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("components.quick_actions")}
              </Text>
              <View className="flex-row mb-3">
                <QuickActionCard
                  title={t("common.appointment.table.appointments")}
                  icon={Calendar}
                  onPress={() => router.push("/appointments")}
                  count={appointmentsData?.length}
                  color="bg-green-500"
                />
                <QuickActionCard
                  title={t("medical_records.index_title")}
                  icon={FileText}
                  onPress={() => router.push("/medical-records")}
                  count={medicalRecordsData?.length}
                  color="bg-blue-500"
                />
              </View>
              <View className="flex-row">
                <QuickActionCard
                  title={t("links.prescriptions")}
                  icon={Pill}
                  onPress={() => router.push("/prescriptions")}
                  count={prescriptionsData?.length}
                  color="bg-purple-500"
                />
                <QuickActionCard
                  title={t("components.attachments")}
                  icon={Paperclip}
                  onPress={() => router.push("/attachments")}
                  count={attachmentsData?.length}
                  color="bg-orange-500"
                />
              </View>
            </View>

            {/* Recent Activity */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("components.recent_activity")}
              </Text>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("components.notifications")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notificationsData && notificationsData.length > 0 ? (
                    <View>
                      {notificationsData
                        .slice(0, 3)
                        .map((notification, index: number) => {
                          const payload = new NotificationPayload(
                            notification.data ?? {},
                          );
                          return (
                            <View
                              key={index}
                              className="flex-row items-center py-2 border-b border-border last:border-b-0"
                            >
                              <Bell
                                size={16}
                                className="text-muted-foreground mr-2"
                              />
                              <Text
                                className="flex-1 text-sm"
                                numberOfLines={2}
                              >
                                {payload.message}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ) : (
                    <Text className="text-sm text-muted-foreground">
                      {t("components.no_notifications")}
                    </Text>
                  )}
                </CardContent>
              </Card>
            </View>
          </>
        ) : (
          // Unauthenticated User Content
          <>
            {/* Welcome Message */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <View className="items-center mb-4">
                  <Stethoscope size={48} className="text-primary mb-2" />
                </View>
              </CardContent>
            </Card>

            {/* Features */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("landing.features_services")}
              </Text>
              <View className="space-y-3">
                <Card>
                  <CardContent className="p-4 flex-row items-center">
                    <Calendar size={24} className="text-primary mr-3" />
                    <View className="flex-1">
                      <Text className="font-semibold">
                        {t("landing.appointment_management")}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {t("landing.easley_schedule")}
                      </Text>
                    </View>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex-row items-center">
                    <FileText size={24} className="text-primary mr-3" />
                    <View className="flex-1">
                      <Text className="font-semibold">
                        {t("landing.patient_records")}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {t("landing.access_records")}
                      </Text>
                    </View>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex-row items-center">
                    <Building2 size={24} className="text-primary mr-3" />
                    <View className="flex-1">
                      <Text className="font-semibold">
                        {t("sideBar.clinics")}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {t("landing.control_appointments")}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              </View>
            </View>

            {/* Call to Action */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("landing.get_started")}
              </Text>
              <View className="space-y-3">
                <Button
                  onPress={() => router.push("/(auth)/login")}
                  className="flex-row items-center justify-center gap-2"
                >
                  <LogIn size={20} className="mr-2 text-primary-foreground" />
                  <Text className="text-primary-foreground">
                    {t("auth.signIn")}
                  </Text>
                </Button>

                <Button
                  variant="secondary"
                  onPress={() => router.push("/(auth)/register")}
                  className="flex-row items-center gap-2 justify-center mt-2"
                >
                  <UserPlus
                    size={20}
                    className="mr-2 text-secondary-foreground"
                  />
                  <Text>{t("auth.sign_up")}</Text>
                </Button>
              </View>
            </View>

            {/* Quick Links */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3">
                {t("landing.quick_links")}
              </Text>
              <View className="flex-row flex-wrap">
                <Button
                  variant="ghost"
                  onPress={() => router.push("/(tabs)/clinics")}
                  className="flex-row items-center mr-2 mb-2"
                >
                  <Stethoscope size={16} className="mr-1 text-primary" />
                  <Text>{t("sideBar.clinics")}</Text>
                </Button>

                <Button
                  variant="ghost"
                  onPress={() => router.push("/(tabs)/specialities")}
                  className="flex-row items-center mr-2 mb-2"
                >
                  <Clock size={16} className="mr-1 text-primary" />
                  <Text>{t("landing.specialities")}</Text>
                </Button>

                <Button
                  variant="ghost"
                  onPress={() => router.push("/(tabs)/services")}
                  className="flex-row items-center mr-2 mb-2"
                >
                  <Building2 size={16} className="mr-1 text-primary" />
                  <Text>{t("sideBar.services")}</Text>
                </Button>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
