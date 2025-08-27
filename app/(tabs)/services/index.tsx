import LabelValue from "@/components/label-value";
import useListPage from "@/components/ListPage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/localization";
import { ServiceService } from "@/services/ServiceService";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Services = () => {
  const { t } = useTranslation();
  const service = ServiceService.make();
  const router = useRouter();
  const { Render } = useListPage({
    api(page, search, params) {
      return service.indexWithPagination(
        page,
        search,
        undefined,
        undefined,
        undefined,
        params,
      );
    },
    queryKey: "services_list",
    renderItem: ({ item }) => (
      <Pressable
        className="mb-4 flex-row items-stretch overflow-hidden"
        onPress={() => {
          router.push({
            pathname: `/clinics/[id]`,
            params: {
              id: item.clinic_id,
            },
          });
        }}
      >
        <View className="w-1.5 bg-primary rounded-l-lg" />
        <Card className="flex-1 p-0 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Text>{item.name}</Text>
            </CardTitle>
            <CardDescription>
              <Text>{item.description}</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabelValue
              label={t("landing.approximate_waiting_time")}
              value={item.approximate_duration}
            />
            <LabelValue
              label={t("admin.service.show.price")}
              value={item.price}
            />

            <LabelValue
              label={t("admin.service.show.category")}
              value={item.service_category?.name}
            />

            <LabelValue
              label={t("common.appointment.show.doctorName")}
              value={item.clinic?.user?.full_name}
            />
          </CardContent>
        </Card>
      </Pressable>
    ),
  });
  return <Render />;
};

export default Services;
