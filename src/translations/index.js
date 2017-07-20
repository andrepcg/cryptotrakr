import I18n from 'react-native-i18n';

import pt from './pt';
import en from './en';
import hi from './hi';

I18n.fallbacks = true;

I18n.translations = {
  en,
  pt,
  hi,
};

export default I18n;

export function setLocale(lang) {
  I18n.locale = lang;
}
