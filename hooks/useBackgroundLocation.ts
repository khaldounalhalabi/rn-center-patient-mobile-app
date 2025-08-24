// backgroundLocation.ts
import AttendanceLogTypeEnum from "@/enums/AttendanceLogTypeEnum";
import { getRole } from "@/helpers/helpers";
import { GET } from "@/http/Http";
import AttendanceLog from "@/models/AttendanceLog";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert, Platform } from "react-native";

const BACKGROUND_LOCATION_TASK = "background-location-task";
const TARGET_LOCATION = {
  latitude: 33.49569295499499,
  longitude: 36.29438316107189,
};
const RADIUS_METERS = 50;

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function checkoutIfNeeded() {
  const role = await getRole();
  const lastLog = (
    await GET<AttendanceLog | undefined>(`${role}/attendances/latest`)
  ).data;
  if (lastLog && lastLog.type === AttendanceLogTypeEnum.CHECKIN) {
    await GET<AttendanceLog | undefined>(`${role}/attendances/checkout`);
  }
}

// Background task — no hooks here
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    return;
  }
  if (!data) return;

  // @ts-ignore
  const { locations }: { locations: Location.LocationObject[] } = data;
  const currentLocation = locations[0];
  const distance = getDistance(
    currentLocation.coords.latitude,
    currentLocation.coords.longitude,
    TARGET_LOCATION.latitude,
    TARGET_LOCATION.longitude,
  );

  if (distance > RADIUS_METERS) {
    await checkoutIfNeeded();
  }
});

// Hook
export default function useBackgroundLocation() {
  return async () => {
    if (__DEV__) {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK,
      );
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }
    }

    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Foreground location permission is required.",
      );
      return;
    }

    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Background location permission is required to track while the app is closed.",
      );
      return;
    }

    // Immediate distance check
    try {
      const current = await Location.getCurrentPositionAsync({});
      const distance = getDistance(
        current.coords.latitude,
        current.coords.longitude,
        TARGET_LOCATION.latitude,
        TARGET_LOCATION.longitude,
      );

      if (distance > RADIUS_METERS) {
        await checkoutIfNeeded();
      }
    } catch (e: any) {}

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
      showsBackgroundLocationIndicator: true,
      foregroundService:
        Platform.OS === "android"
          ? {
              notificationTitle: "Location Tracking",
              notificationBody: "Tracking your location for attendance.",
            }
          : undefined,
    });

    Alert.alert("Tracking Started", "Background location tracking is active.");
  };
}
