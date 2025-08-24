import { getLocale, getToken } from "@/helpers/helpers";
import AppConfig from "@/lib/Config";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export default function useFileDownload() {
  const BASE_URL = AppConfig.BACKEND_URL;
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (
    url: string,
    filename: string,
    mimeType = "application/pdf",
  ) => {
    setIsDownloading(true);
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        Accept: mimeType,
        "Accept-Language": await getLocale(),
        Authorization: token ? `Bearer ${token}` : "",
      };
      const fullUrl = url.startsWith("http")
        ? url
        : `${BASE_URL}${url.replace(/^\//, "")}`;
      const fileUri = FileSystem.documentDirectory + filename;
      const downloadRes = await FileSystem.downloadAsync(fullUrl, fileUri, {
        headers,
      });

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: mimeType,
        });
      } else {
        await Sharing.shareAsync(downloadRes.uri, { mimeType });
      }
    } catch (error: any) {
      Alert.alert("Download failed", error.message || "Unknown error");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading };
}
