import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';

const ns = Object.keys(Object.values(resources)[0] || {});
export const defaultNS = 'common';

const defaultLang = 'vn';

const LANGUAGE_LOCAL_CODES: Record<string, string> = {
  vn: 'vi',
  en: 'en',
  jp: 'ja',
};

i18n
  .use(initReactI18next)
  .init({
    ns,
    defaultNS,
    resources,
    lng: defaultLang,
    fallbackLng: 'vn',
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
