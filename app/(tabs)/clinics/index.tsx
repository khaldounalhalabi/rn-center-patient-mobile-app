import LabelValue from "@/components/label-value";
import useListPage from "@/components/ListPage";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/localization";
import { ClinicsService } from "@/services/ClinicsService";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Clinics = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const service = ClinicsService.make();
  const { Render } = useListPage({
    api(page, search, params) {
      return service.indexWithPagination(page, search);
    },
    enableSearch: true,
    queryKey: "clinics_index",
    renderItem: ({ item }) => (
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/clinics/[id]`,
            params: { id: item.id },
          });
        }}
        className="mb-4 flex-row items-stretch overflow-hidden"
      >
        <View className="w-1.5 bg-primary rounded-l-lg" />
        <Card className="flex-1 p-0 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Text>{item.user?.full_name}</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LabelValue
              label={t("common.appointment.create.clinic_appointment_cost")}
              value={item.appointment_cost}
            />
            <LabelValue
              label={t("admin.clinic.show.experienceY")}
              value={item.experience_years}
            />
            <LabelValue
              label={t("details.gender")}
              value={<TranslatableEnum value={item.user?.gender} />}
            />
            <LabelValue
              label={t("admin.clinic.show.maxAppointmentsPerDay")}
              value={item.max_appointments}
            />
          </CardContent>
        </Card>
      </Pressable>
    ),
  });
  return <Render />;
};

export default Clinics;
