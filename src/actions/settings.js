// import { startBackgroundPriceUpdater, cancelTask } from '../utils/backgroundTasks';
import { setLocale as setLocaleF } from '../translations';

export const TOGGLE_ACTIVE_NOTIFICATION = 'TOGGLE_ACTIVE_NOTIFICATION';
export const SET_NOTIFICATION_EXCHANGE = 'SET_NOTIFICATION_EXCHANGE';
export const SET_CURRENCY = 'SET_CURRENCY';
export const SET_LOCALE = 'SET_LOCALE';


export const toggleActiveNotification = (on, exchange) => {
  // if (on) startBackgroundPriceUpdater(exchange);
  // else cancelTask();

  return { type: TOGGLE_ACTIVE_NOTIFICATION, payload: on };
};

export const setNotificationExchange = exchangeId =>
  ({ type: SET_NOTIFICATION_EXCHANGE, exchangeId });

export const setCurrency = currency =>
  ({ type: SET_CURRENCY, payload: currency });

export const setLocale = (locale) => {
  setLocaleF(locale);
  return { type: SET_LOCALE, payload: locale };
};
