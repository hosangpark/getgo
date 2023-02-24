import { resources, defaultNS } from "./i18n";
import English from './English.json'
import Korean from './Korean.json'
import Indonesian from './Indonesian.json'

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["ko"];
  }
}