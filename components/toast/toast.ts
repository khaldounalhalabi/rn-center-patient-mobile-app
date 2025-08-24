import { ToastAndroid } from "react-native";

export const toast = {
  success: (message: string = "") =>
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    ),
  error: (message: string = "") =>
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    ),
};
