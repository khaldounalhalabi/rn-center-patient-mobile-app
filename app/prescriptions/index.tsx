import LabelValue from "@/components/label-value";
import useListPage from "@/components/ListPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/localization";
import { PrescriptionService } from "@/services/PrescriptionsServise";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Prescriptions = () => {
  const service = PrescriptionService.make();
  const router = useRouter();
  const { t } = useTranslation();
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
    renderItem: ({ item }) => (
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/prescriptions/[id]`,
            params: { id: item.id },
          });
        }}
        className="mb-4 flex-row items-stretch overflow-hidden"
      >
        <View className="w-1.5 bg-primary rounded-l-lg" />
        <Card className="flex-1 p-0 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Text>{item.created_at}</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LabelValue
              label={t("admin.service.table.doctor_name")}
              value={item?.clinic?.user?.full_name}
            />
            <LabelValue
              label={t("common.prescription.next_visit")}
              value={item?.next_visit}
            />
          </CardContent>
        </Card>
      </Pressable>
    ),
    queryKey: "prescriptions_index",
  });
  return <Render />;
};

export default Prescriptions;
