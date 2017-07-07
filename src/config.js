import { Platform } from 'react-native';
import * as styles from './styles';

export const appName = 'Crypto Trakr';

export const API_URL = 'https://cryptotrakr.herokuapp.com';
export const CRYPTOWATCH_API_URL = 'https://api.cryptowat.ch';
export const BUGS_EMAIL = 'bug@cryptotrakr.com';

export const exchanges = [
  { id: 'gdax', name: 'GDAX' },
  { id: 'btce', name: 'BTC-e' },
  { id: 'bitfinex', name: 'Bitfinex' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'kraken', name: 'Kraken' },
  { id: 'poloniex', name: 'Poloniex' },
  { id: 'quoine', name: 'Quoine' },
  { id: 'okcoin', name: 'OKCoin' },
  { id: 'bitstamp', name: 'Bitstamp' },
  { id: 'cexio', name: 'CEX.io' },
  { id: 'qryptos', name: 'QRYPTOS' },
  { id: 'bitsquare', name: 'Bitsquare' },
];

export const pairs = [
  { id: 'etheur', name: 'ETH/EUR', crypto: 'eth' },
  { id: 'ethusd', name: 'ETH/USD', crypto: 'eth' },
  { id: 'ethbtc', name: 'ETH/BTC', crypto: 'eth' },
  { id: 'btcusd', name: 'BTC/USD', crypto: 'btc' },
  { id: 'btceur', name: 'BTC/EUR', crypto: 'btc' },
  { id: 'ltcusd', name: 'LTC/USD', crypto: 'ltc' },
  { id: 'ltceur', name: 'LTC/EUR', crypto: 'ltc' },
  { id: 'ltcbtc', name: 'LTC/BTC', crypto: 'ltc' },
  { id: 'xrpeur', name: 'XRP/EUR', crypto: 'xrp' },
  { id: 'xrpusd', name: 'XRP/USD', crypto: 'xrp' },
  { id: 'dasheur', name: 'DASH/EUR', crypto: 'dash' },
  { id: 'dashusd', name: 'DASH/USD', crypto: 'dash' },
  { id: 'xmreur', name: 'XMR/EUR', crypto: 'xmr' },
  { id: 'xmrusd', name: 'XMR/USD', crypto: 'xmr' },
  { id: 'zeceur', name: 'ZEC/EUR', crypto: 'zec' },
  { id: 'zecusd', name: 'ZEC/USD', crypto: 'zec' },
];


export const cryptos = [
  { id: 'eth', name: 'ETH', longName: 'Ethereum', color: styles.DARKER_BLUE },
  { id: 'btc', name: 'BTC', longName: 'Bitcoin', color: styles.ORANGE },
  { id: 'ltc', name: 'LTC', longName: 'Litecoin', color: '#88CBF5' },
  { id: 'xrp', name: 'XRP', longName: 'Ripple', color: styles.GREEN },
  { id: 'dash', name: 'DASH', longName: 'Dash', color: '#1c75bc' },
  { id: 'xmr', name: 'XMR', longName: 'Monero', color: '#ff7519' },
  { id: 'zec', name: 'ZEC', longName: 'Zcash', color: '#4a2256' },
];

export const currencies = [
  { id: 'usd', name: 'USD' },
  { id: 'eur', name: 'EUR' },
  { id: 'gbp', name: 'GBP' },
];

export const products = [
  { id: 'beer', defaultValue: false },
  { id: 'premium', defaultValue: Platform.OS === 'ios' },
  { id: 'noads', defaultValue: false },
];

export const freeLimits = {
  alerts: 3,
  favorites: 2,
  portfolio: 4,
};

export const FETCH_PRICES_INTERAVL = 2 * 60 * 1000; // 2 minutes

