import useListPage from "@/components/ListPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useFileDownload from "@/hooks/useFileDownload";
import { useTranslation } from "@/localization";
import { Media } from "@/models/Media";
import AttachmentService from "@/services/AttachmentService";
import { View } from "react-native";

const AttachmentItem = ({ item }: { item: Media }) => {
  const { downloadFile, isDownloading } = useFileDownload();
  const { t } = useTranslation();

  return (
    <View className="mb-4 flex-row items-stretch overflow-hidden">
      <View className="w-1.5 bg-primary rounded-l-lg" />
      <Card className="flex-1 p-0 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>
            <Text>{item.file_name}</Text>
          </CardTitle>
          <CardDescription>
            <Text>{item.file_type}</Text>
            <Text className="text-muted-foreground">
              {" "}
              • {(item.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </CardDescription>
          <View className="mt-2">
            <Button
              onPress={() =>
                downloadFile(item.file_url, item.file_name, item.file_type)
              }
              disabled={isDownloading}
              className="flex flex-row gap-2"
            >
              <Text>{t("components.download")}</Text>
              {isDownloading && (
                <LoadingSpinner className="text-primary-foreground" />
              )}
            </Button>
          </View>
        </CardHeader>
      </Card>
    </View>
  );
};

const Attachments = () => {
  const service = AttachmentService.make();
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
    renderItem: ({ item }: { item: Media }) => <AttachmentItem item={item} />,
    queryKey: "attachments_index",
  });
  return <Render />;
};

export default Attachments;
