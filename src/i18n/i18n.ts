import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import resources from './resources';

const ns = Object.keys(Object.values(resources)[0] || {});
export const defaultNS = 'common';

export type SupportedLanguage = 'vn' | 'en' | 'jp' | 'id';

const defaultLang: SupportedLanguage = 'en';
const supportedLanguages = new Set<SupportedLanguage>(['vn', 'en', 'jp', 'id']);

const LANGUAGE_LOCAL_CODES: Record<string, string> = {
  vn: 'vi',
  en: 'en',
  jp: 'ja',
  id: 'id',
};

const DEVICE_LANGUAGE_CODES: Record<string, SupportedLanguage> = {
  vi: 'vn',
  en: 'en',
  ja: 'jp',
  id: 'id',
};

i18n
  .use(initReactI18next)
  .init({
    ns,
    defaultNS,
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export { default } from 'i18next';

export function getLanguageLocaleCode(language: string): string {
  return LANGUAGE_LOCAL_CODES[language] ?? 'en';
}

export function getDeviceLanguage(): SupportedLanguage {
  const deviceLanguageCode = getLocales()[0]?.languageCode?.toLowerCase();
  return deviceLanguageCode ? DEVICE_LANGUAGE_CODES[deviceLanguageCode] ?? defaultLang : defaultLang;
}

export function getSupportedLanguage(language: string): SupportedLanguage {
  return supportedLanguages.has(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : defaultLang;
}
