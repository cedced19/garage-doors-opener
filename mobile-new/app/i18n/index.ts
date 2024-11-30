import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationEn from "./locales/en-US/translation.json";
import translationDe from "./locales/de-DE/translation.json";
import translationFr from "./locales/fr-FR/translation.json";

const resources = {
    "en": { translation: translationEn },
    "fr": { translation: translationFr },
    "de": { translation: translationDe },
};

const initI18n = async () => {
    const lng = Localization.getLocales()[0].languageCode;

    i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        resources,
        lng: lng,
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;