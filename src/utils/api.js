import moment from 'moment';

import { API_URL, CRYPTOWATCH_API_URL } from '../config';

export function fetchExchangeRates() {
  return fetchAsync(`${API_URL}/exchange_ratess`);
}

export function fetchMarketSummaries() {
  return fetchAsync(`${API_URL}/summaries`).catch(console.error);
}

export function fetchExchangeOhlc(exchangeId, currency = 'usd', crypto = 'eth', periods = '60', after = moment().subtract(1, 'hours').unix(), before) {
  const url = `${CRYPTOWATCH_API_URL}/markets/${exchangeId}/${crypto}${currency}/ohlc`;
  const params = { after, periods };
  if (before) params.before = before;
  return fetchAsync(url, params).catch(console.error);
}

export function fetchLastTrades(exchangeId, currency = 'usd', crypto = 'eth', limit = 50) {
  const url = `${CRYPTOWATCH_API_URL}/markets/${exchangeId}/${crypto}${currency}/trades`;
  return fetchAsync(url, { limit }).catch(console.error);
  // [ ID, Timestamp, Price, Amount ]
}

async function fetchAsync(url, params = {}) {
  try {
    const response = await fetch(`${url}?${query(params)}`);
    const data = await response.json();
    return data.hasOwnProperty('result') ? data.result : data;
  } catch (err) {
    // console.error(err);
    throw err;
    // return err;
  }
}

const query = params => Object.keys(params)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join('&');
