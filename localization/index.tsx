import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import ArabicTranslatation from "./languages/arabic.json";
import EnglishTranslations from "./languages/english.json";

export const i18n = new I18n({
  en: EnglishTranslations,
  ar: ArabicTranslatation,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;

const deviceLocale =
  Localization.getLocales()[0]?.languageCode || i18n.defaultLocale;
i18n.locale = deviceLocale;

import { useCallback } from "react";

function join<T extends string, U extends string>(a: T, b: U): `${T}.${U}` {
  return `${a}.${b}` as const;
}

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? // @ts-ignore
      `${Key}${DotPrefix<NestedKeyOf<ObjectType[Key]>>}`
    : Key;
}[keyof ObjectType & string];

type TranslationKey = NestedKeyOf<typeof EnglishTranslations>;

export type { TranslationKey };

export function useTranslation() {
  const t = useCallback(
    (key: TranslationKey, options?: any) => i18n.t(key, options),
    [i18n.locale],
  );
  return { t, locale: i18n.locale, i18n };
}
