import { fetchMarketSummaries, fetchExchangeOhlc } from '../utils/api';
import { filterOhlcData } from '../utils/prices';
import { timeframeToMoment } from '../utils/timeframes';
import { logEvent } from '../firebase';

export const FETCHING_PRICES = 'FETCHING_PRICES';
export const RECEIVE_PRICES = 'RECEIVE_PRICES';
export const TOGGLE_FAVORITE_EXCHANGE = 'TOGGLE_FAVORITE_EXCHANGE';
export const FETCHING_OHLC = 'FETCHING_OHLC';
export const RECEIVE_OHLC = 'RECEIVE_OHLC';

export function fetchPrices() {
  return async (dispatch) => {
    dispatch({ type: FETCHING_PRICES });
    try {
      const result = await fetchMarketSummaries();
      dispatch({ type: RECEIVE_PRICES, payload: result });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  };
}

export function fetchOhlc(exchangeId, currency, crypto, periods, timeframe) {
  return async (dispatch) => {
    dispatch({ type: FETCHING_OHLC });
    try {
      const result = await fetchExchangeOhlc(exchangeId, currency, crypto, periods, timeframeToMoment(timeframe).unix());
      dispatch({ type: RECEIVE_OHLC, payload: filterOhlcData(result) });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  };
}

export const setFavoritePair = (pair, exchange) => {
  logEvent('favorite_exchange', { pair, exchange });
  return { type: TOGGLE_FAVORITE_EXCHANGE, payload: { pair, exchange } };
};
