import I18n from 'react-native-i18n';

import pt from './pt';
import en from './en';

I18n.fallbacks = true;

// <Text>{I18n.t('greeting')}</Text>

I18n.translations = {
  en,
  pt,
};

export default I18n;
