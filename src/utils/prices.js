import { filter, mean, toUpper } from 'lodash';
import money from 'money';

import { fetchExchangeRates } from './api';
import rates from '../rates.json';

fetchExchangeRates().then((json) => {
  money.rates = json.rates;
  money.base = json.base;
}).catch(() => {
  money.rates = rates.rates;
  money.base = rates.base;
});

export function filterOhlcData(apiData) {
  const newObj = {};
  Object.keys(apiData).forEach((key) => {
    const value = apiData[key];
    newObj[key] = filter(value, d => d[1] !== 0);
  });
  return newObj;
}

export function candleMean(candle) { // [timestamp, open, high, low, close, volume]
  if (!candle || candle.length === 0) return -1;
  return mean(candle.slice(1, candle.length - 1));
}

export const convertMoney = (a, fromCur, to) =>
  money(a).from(toUpper(fromCur)).to(toUpper(to));
