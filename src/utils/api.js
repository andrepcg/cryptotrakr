import { ToastAndroid, Platform } from 'react-native';
import moment from 'moment';

import { API_URL, CRYPTOWATCH_API_URL } from '../config';

export function fetchMarketSummaries() {
  // https://ethereumwatch.herokuapp.com/summaries
  return fetchAsync(`${API_URL}/summaries`);
}

export function fetchExchangeOhlc(exchangeId, currency = 'usd', crypto = 'eth', periods = '60', after = moment().subtract(1, 'hours').unix(), before) {
  const url = `${CRYPTOWATCH_API_URL}/markets/${exchangeId}/${crypto}${currency}/ohlc`;
  const params = { after, periods };
  if (before) params.before = before;
  return fetchAsync(url, params);
}

export function fetchLastTrades(exchangeId, currency = 'usd', crypto = 'eth', limit = 50) {
  const url = `${CRYPTOWATCH_API_URL}/markets/${exchangeId}/${crypto}${currency}/trades`;
  return fetchAsync(url, { limit });
  // [ ID, Timestamp, Price, Amount ]
}

async function fetchAsync(url, params = {}) {
  try {
    // console.log('GET', `${url}?${query(params)}`);
    const response = await fetch(`${url}?${query(params)}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    // if (Platform.OS === 'android') ToastAndroid.show('Fetch failed', ToastAndroid.SHORT);
    // throw err;
    return;
  }
}

const query = params => Object.keys(params)
  .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join('&');
