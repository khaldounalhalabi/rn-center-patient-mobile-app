import useListPage from "@/components/ListPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CheckCircle } from "@/lib/icons/icons";
import { NotificationPayload } from "@/models/NotificationPayload";
import { NotificationService } from "@/services/NotificationService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const [mutating, setMutating] = React.useState<string>("");
  const service = NotificationService.make();

  const queryClient = useQueryClient();
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      setMutating(notificationId);
      return await service.markAsRead(notificationId);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["unread_notifications_count"],
      });
      refetch().then(() => {
        setMutating("");
      });
    },
  });

  const { Render, refetch } = useListPage({
    api: (page, search, params) =>
      service.indexWithPagination(
        page,
        search,
        undefined,
        undefined,
        6,
        params,
      ),
    queryKey: "app_notifications",
    enableSearch: false,
    renderItem: ({ item }) => {
      const notification = new NotificationPayload(item.data ?? {});
      return (
        <Pressable
          onPress={() => {
            router.push(notification.getUrl());
            if (!item?.read_at) {
              markAsRead.mutate(item?.id);
            }
          }}
        >
          <View
            className={
              "w-full max-w-vw flex flex-row justify-between items-center border border-input rounded-md bg-card p-5 gap-2 my-2"
            }
          >
            <View className={"max-w-[80%]"}>
              <Text className={"text-wrap"}>{notification.message}</Text>
            </View>
            <Button
              disabled={item?.read_at != undefined}
              size={"icon"}
              variant={item?.read_at ? "ghost" : "default"}
              onPress={() => {
                if (!item?.read_at) {
                  markAsRead.mutate(item?.id);
                }
              }}
            >
              {mutating == item?.id ? (
                <LoadingSpinner size={24} />
              ) : (
                <CheckCircle
                  className={
                    item.read_at ? "text-primary" : "text-primary-foreground"
                  }
                />
              )}
            </Button>
          </View>
        </Pressable>
      );
    },
  });

  return <Render />;
};

export default Index;
