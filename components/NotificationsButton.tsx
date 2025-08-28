import { Button } from "@/components/ui/button";
import StyledText from "@/components/ui/styled-text";
import { Bell } from "@/lib/icons/icons";
import { NotificationService } from "@/services/NotificationService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const NotificationsButton = () => {
  const router = useRouter();
  const service = NotificationService.make();
  const { data: unreadCount } = useQuery({
    queryKey: ["unread_notifications_count"],
    queryFn: async () => await service.unreadCount(),
    select: (data) => data?.data?.unread_count ?? 0,
  });

  return (
    <Button
      variant={"outline"}
      onPress={() => {
        router.push("/notifications");
      }}
      size={"icon"}
      className={"ms-2"}
    >
      <Bell className={"text-primary"} />

      {unreadCount != undefined && unreadCount > 0 && (
        <View className="absolute flex items-center justify-center text-xs bg-destructive -right-0 top-0 w-5 h-5 rounded-full">
          <StyledText className={"text-xs text-white text-center"}>
            {unreadCount > 9 ? "+9" : unreadCount}
          </StyledText>
        </View>
      )}
    </Button>
  );
};

export default NotificationsButton;
