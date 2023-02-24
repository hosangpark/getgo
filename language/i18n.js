import i18next from "i18next";
import English from './English.json'
import Korean from './Korean.json'
import Indonesian from './Indonesian.json'
import { initReactI18next } from "react-i18next";



// export const resources = {
//   en: {
//     ns1,
//     ns2,
//   },
// } as const;

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng:'Ko',
  fallbackLng: "Ko",
  // defaultNS,
  resources:{
    ko:Korean,
    Id:Indonesian,
    En:English
  },
  interpolation: {
    escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
  React:{
    useSuspense:false
  }
})

export default i18next