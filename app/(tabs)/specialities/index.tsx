import useListPage from "@/components/ListPage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SpecialityService } from "@/services/SpecialityService";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

const Index = () => {
  const service = SpecialityService.make();
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
    renderItem: ({ item }) => (
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/specialities/[id]`,
            params: { id: item.id },
          });
        }}
        className="mb-4 flex-row items-stretch overflow-hidden"
      >
        <View className="w-1.5 bg-primary rounded-l-lg" />
        <Card className="flex-1 p-0 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Text>{item.name}</Text>
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      </Pressable>
    ),
  });
  return <Render />;
};

export default Index;
