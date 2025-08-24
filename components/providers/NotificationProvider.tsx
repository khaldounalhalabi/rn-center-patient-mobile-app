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
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
  const { user, role } = useUser();
  const queryClient = useQueryClient();

  const handleMessage = async (payload: RemoteMessage) => {
    const notification = new NotificationPayload(payload?.data ?? {});
    handlers.forEach((handler) => {
      handler.fn(notification);
    });

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
  };

  const messaging = getMessaging();
  useEffect(() => {
    // Foreground

    return onMessage(messaging, (message) => {
      handleMessage(message);
    });
  }, [handlers, fcmToken, user]);

  setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    const notification = new NotificationPayload(remoteMessage?.data ?? {});
    handlers.forEach((handler) => {
      handler.fn(notification);
    });
    const notificationsCount = (
      await NotificationService.make(role).unreadCount()
    ).data.unread_count;
    await Notifications.setBadgeCountAsync(notificationsCount ?? 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.message,
        data: remoteMessage.data,
      },
      trigger: null,
    });
  });

  useEffect(() => {
    // Background

    // Taps (foreground/background/closed)
    const tapSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const notification = new NotificationPayload(data);
        router.push(notification.getUrl() as any);
      });

    // Handle if app opened from closed state
    (async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const data = response.notification.request.content.data;
        const notification = new NotificationPayload(data);
        router.push(notification.getUrl() as any);
      }
    })();

    return () => {
      tapSubscription.remove();
    };
  }, [router, role]);

  return (
    <NotificationsHandlersContext.Provider value={setHandlers}>
      {children}
    </NotificationsHandlersContext.Provider>
  );
};

export default NotificationProvider;
