export interface Translatable {
  en?: string;
  ar?: string;
}

export type Locales = keyof Translatable;
