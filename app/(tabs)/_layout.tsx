import AuthProvider from "@/components/providers/AuthProvider";
import useUser from "@/hooks/UserHook";
import { i18n, useTranslation } from "@/localization";
import { Tabs } from "expo-router";
import {
  Ambulance,
  CrossIcon,
  HomeIcon,
  Stethoscope,
  TentTree,
} from "lucide-react-native";
import React from "react";

const TabLayout = () => {
  const { t } = useTranslation();
  const locale = i18n.locale;
  const { user } = useUser();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
        }}
      >
        <Tabs.Screen
          name="holidays"
          options={{
            title: t("holidays.holidays"),
            tabBarIcon: ({ color }) => <TentTree color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
          }}
        />

        <Tabs.Screen
          name="clinics"
          options={{
            title: t("components.doctors"),
            tabBarIcon: ({ color }) => <CrossIcon color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: t("landing.home"),
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
          }}
        />

        <Tabs.Screen
          name="specialities"
          options={{
            title: t("landing.specialities"),
            tabBarIcon: ({ color }) => <Stethoscope color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
          }}
        />

        <Tabs.Screen
          name="services"
          options={{
            title: t("sideBar.services"),
            tabBarIcon: ({ color }) => <Ambulance color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
          }}
        />
      </Tabs>
    </AuthProvider>
  );
};

export default TabLayout;
