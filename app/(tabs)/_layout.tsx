import AuthProvider from "@/components/providers/AuthProvider";
import useUser from "@/hooks/UserHook";
import { Calendar } from "@/lib/icons/icons";
import { i18n, useTranslation } from "@/localization";
import { Tabs } from "expo-router";
import { HomeIcon } from "lucide-react-native";
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
          name="appointments"
          options={{
            title: t("landing.appointments"),
            tabBarIcon: ({ color }) => <Calendar color={color} />,
            tabBarLabelStyle: {
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
            },
            href: user ? { pathname: "/appointments" } : null,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
};

export default TabLayout;
