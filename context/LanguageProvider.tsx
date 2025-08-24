import { useTranslation } from "@/localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import * as Updates from "expo-updates";
import React, { createContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";

export const LANGUAGE_KEY = "selected_language";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      i18n.locale = savedLanguage ?? "en";
    };

    loadLanguage();
  }, []);

  const updateLanguage = async (newLanguage: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    setLanguage(newLanguage);

    if (newLanguage && newLanguage != language) {
      i18n.locale = newLanguage;
      if (newLanguage == "ar") {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      } else {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      }
      Updates.reloadAsync();
    } else if (Array.isArray(getLocales())) {
      i18n.locale = getLocales()[0].languageCode ?? "en";
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
