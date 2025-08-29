import { POST } from "@/http/Http";
import {
  getToken as getFirebaseToken,
  getMessaging,
  requestPermission,
} from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import useUser from "./UserHook";

function useFcmToken() {
  const [token, setToken] = useState("");
  const { user } = useUser();

  const getToken = async () => {
    if (!Device.isDevice || !user) {
      return;
    }

    if (Platform.OS == "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    const messaging = getMessaging();
    await requestPermission(messaging);

    try {
      const currentToken = await getFirebaseToken(messaging);
      await POST(`/fcm/store-token`, {
        fcm_token: currentToken,
      });
      setToken(currentToken);
    } catch (error: unknown) {
      console.error("Error getting FCM token:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [user]);

  return token ?? "";
}

export default useFcmToken;
