import "@/global.css";

import { LanguageToggleButton } from "@/components/LanguageToggleButton";
import NotificationsButton from "@/components/NotificationsButton";
import ProfileButton from "@/components/profile/ProfileButton";
import LocationTrackingProvider from "@/components/providers/LocationTrackingProvider";
import NotificationProvider from "@/components/providers/NotificationProvider";
import UserProvider from "@/components/providers/UserProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggleButton";
import { LanguageProvider } from "@/context/LanguageProvider";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import "@/localization";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const unstable_settings = {
  initialRouteName: "index",
};

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            retry: 3,
            retryDelay: 100,
          },
        },
      }),
  );

  dayjs.extend(duration);
  dayjs.extend(isBetween);

  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  onlineManager.setEventListener((setOnline) => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected);
    });
    return eventSubscription.remove;
  });

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <UserProvider>
              <NotificationProvider>
                <LocationTrackingProvider>
                  <ThemeProvider
                    value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
                  >
                    <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
                    <Stack
                      screenOptions={{
                        headerShown: true,
                        headerRight: () => (
                          <>
                            <ThemeToggle />
                            <LanguageToggleButton />
                            <NotificationsButton />
                          </>
                        ),
                        headerTitle: "",
                        headerLeft: () => <ProfileButton />,
                      }}
                    />
                  </ThemeProvider>
                </LocationTrackingProvider>
              </NotificationProvider>
            </UserProvider>
          </LanguageProvider>
        </QueryClientProvider>
        <PortalHost />
      </GestureHandlerRootView>
    </>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
