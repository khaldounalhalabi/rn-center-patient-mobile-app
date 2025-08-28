import { getLocale, getToken } from "@/helpers/helpers";
import AppConfig from "@/lib/Config";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { useTranslation } from "@/localization";

export default function useFileDownload() {
  const BASE_URL = AppConfig.BACKEND_URL;
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useTranslation();

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("components.permission_required"),
          t("components.storage_permission_message"),
        );
        return false;
      }
    }
    return true;
  };

  const showDownloadNotification = async (
    filename: string,
    fileUri: string,
    mimeType: string,
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t("components.download_complete"),
          body: t("components.file_saved_to_device", { filename }),
          data: {
            fileUri,
            filename,
            mimeType,
            type: "file_download",
            action: "open_file", // Action to open file instead of navigating
          },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {}
  };

  const downloadFile = async (
    url: string,
    filename: string,
    mimeType = "application/pdf",
  ) => {
    setIsDownloading(true);
    try {
      // Request permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsDownloading(false);
        return;
      }

      const token = await getToken();
      const headers: Record<string, string> = {
        Accept: mimeType,
        "Accept-Language": await getLocale(),
        Authorization: token ? `Bearer ${token}` : "",
      };

      const fullUrl = url.startsWith("http")
        ? url
        : `${BASE_URL}${url.replace(/^\//, "")}`;

      // Download to app's document directory first
      const tempFileUri = FileSystem.documentDirectory + filename;
      const downloadRes = await FileSystem.downloadAsync(fullUrl, tempFileUri, {
        headers,
      });

      if (downloadRes.status !== 200) {
        throw new Error(`Download failed with status: ${downloadRes.status}`);
      }

      // Save to device storage
      let savedAsset: string;
      if (Platform.OS === "android") {
        // For Android, save to media library
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
        // Use the original URI for opening the file
        savedAsset = downloadRes.uri;
      } else {
        // For iOS, we'll use the document directory and show sharing options
        savedAsset = downloadRes.uri;
      }

      // Show success notification
      await showDownloadNotification(filename, savedAsset, mimeType);
    } catch (error: any) {
      Alert.alert(t("components.download_failed"), error.message || t("components.unknown_error"));
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading };
}
