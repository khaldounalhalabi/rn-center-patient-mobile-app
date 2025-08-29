import useFcmToken from "@/hooks/FcmTokenHook";
import useUser from "@/hooks/UserHook";
import { NotificationPayload } from "@/models/NotificationPayload";
import { NotificationService } from "@/services/NotificationService";
import {
  FirebaseMessagingTypes,
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

export const NotificationsHandlersContext = createContext<Dispatch<
  SetStateAction<NotificationHandler[]>
> | null>(null);

export interface NotificationHandler {
  fn: (payload: NotificationPayload) => void;
  key?: string;
  is_active: boolean;
  is_permanent: boolean;
}

const NotificationProvider = ({ children }: { children?: ReactNode }) => {
  const router = useRouter();
  const fcmToken = useFcmToken();
  const [handlers, setHandlers] = useState<NotificationHandler[]>([]);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const service = NotificationService.make();

  const messaging = getMessaging();

  const handleMessage = useCallback(
    async (payload: RemoteMessage) => {
      const notification = new NotificationPayload(payload?.data ?? {});
      if (handlers && handlers.length > 0) {
        handlers.forEach((handler) => {
          handler.fn(notification);
        });
      }

      if (!notification.isNotification()) return;

      await queryClient.invalidateQueries({
        queryKey: ["app_notifications"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["unread_notifications_count"],
      });

      // Use Expo notification to display
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          data: payload.data,
        },
        trigger: null,
      });
    },
    [handlers, queryClient],
  );

  // Set background message handler in useEffect to avoid conditional hooks
  useEffect(() => {
    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      const notification = new NotificationPayload(remoteMessage?.data ?? {});
      if (handlers && handlers.length > 0) {
        handlers.forEach((handler) => {
          handler.fn(notification);
        });
      }
      const notificationsCount =
        (await service.unreadCount())?.data?.unread_count ?? 0;
      await Notifications.setBadgeCountAsync(notificationsCount ?? 0);

      // Only schedule notification if it's not a file download notification
      if (
        !remoteMessage?.data?.type ||
        remoteMessage.data.type !== "file_download"
      ) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.message,
            data: remoteMessage.data,
          },
          trigger: null,
        });
      }
    });
  }, [messaging, handlers, service]);

  useEffect(() => {
    const tapSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;

          // Handle file download notifications
          if (data?.type === "file_download" && data?.action === "open_file") {
            try {
              const { fileUri, mimeType } = data as {
                fileUri: string;
                mimeType: string;
              };
              if (Platform.OS === "android") {
                const contentUri = await FileSystem.getContentUriAsync(fileUri);
                await IntentLauncher.startActivityAsync(
                  "android.intent.action.VIEW",
                  {
                    data: contentUri,
                    flags: 1,
                    type: mimeType || "application/pdf",
                  },
                );
              } else {
                await Sharing.shareAsync(fileUri, {
                  mimeType: mimeType || "application/pdf",
                });
              }
            } catch (error) {
              // Fallback to regular notification handling
              const notification = new NotificationPayload(data);
              router.push(notification.getUrl() as any);
            }
          } else {
            // Handle regular notifications
            const notification = new NotificationPayload(data);
            router.push(notification.getUrl() as any);
          }
        },
      );

    (async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const data = response.notification.request.content.data;

        // Handle file download notifications
        if (data?.type === "file_download" && data?.action === "open_file") {
          try {
            const { fileUri, mimeType } = data as {
              fileUri: string;
              mimeType: string;
            };
            if (Platform.OS === "android") {
              const contentUri = await FileSystem.getContentUriAsync(fileUri);
              await IntentLauncher.startActivityAsync(
                "android.intent.action.VIEW",
                {
                  data: contentUri,
                  flags: 1,
                  type: mimeType || "application/pdf",
                },
              );
            } else {
              await Sharing.shareAsync(fileUri, {
                mimeType: mimeType || "application/pdf",
              });
            }
          } catch (error) {
            // Fallback to regular notification handling
            const notification = new NotificationPayload(data);
            router.push(notification.getUrl() as any);
          }
        } else {
          // Handle regular notifications
          const notification = new NotificationPayload(data);
          router.push(notification.getUrl() as any);
        }
      }
    })();

    return () => {
      tapSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    return onMessage(messaging, (message) => {
      handleMessage(message);
    });
  }, [handlers, fcmToken, user, handleMessage, messaging]);

  return (
    <NotificationsHandlersContext.Provider value={setHandlers}>
      {children}
    </NotificationsHandlersContext.Provider>
  );
};

export default NotificationProvider;
