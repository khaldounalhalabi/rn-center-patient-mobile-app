import { GET, POST } from "@/http/Http";
import {
  AuthorizationStatus,
  getMessaging,
  requestPermission,
  getToken as getFirebaseToken
} from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import useUser from "./UserHook";

function useFcmToken() {
  const [token, setToken] = useState("");
  const { user } = useUser();

  if (!Device.isDevice || !user) {
    return "";
  }

  const getToken = async () => {
    if (Platform.OS == "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    try {
      const currentToken = await getFirebaseToken(messaging);
      await GET<{ fcm_token: string }>(`/fcm/get-token`).then((res) => {
        return res?.data?.fcm_token;
      });
      await POST(`/fcm/store-token`, {
        fcm_token: currentToken,
      });
      setToken(currentToken);
    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  };

  useEffect(() => {
    getToken();
  }, [user]);

  return token;
}

export default useFcmToken;
