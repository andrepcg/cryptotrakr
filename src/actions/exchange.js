import { logEvent } from '../firebase';

export const OPEN_EXCHANGE = 'OPEN_EXCHANGE';
export const CHANGE_CURRENCY = 'CHANGE_CURRENCY';
export const CHANGE_PERIOD = 'CHANGE_PERIOD';

export const openExchange = (exchangeId, name, crypto, currency) => {
  logEvent('open_exchange', { exchangeId, name, crypto, currency });
  return { type: OPEN_EXCHANGE, payload: { exchangeId, name, crypto, currency } };
};

export const changeCurrency = (currency) => {
  logEvent('change_currency', { currency });
  return { type: CHANGE_CURRENCY, payload: currency };
};

export const changePeriod = period =>
  ({ type: CHANGE_PERIOD, payload: period });
