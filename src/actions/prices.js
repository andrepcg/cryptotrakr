import { fetchMarketSummaries, fetchExchangeOhlc, fetchLastTrades } from '../utils/api';
import { filterOhlcData } from '../utils/prices';
import { timeframeToMoment } from '../utils/timeframes';
import { logEvent } from '../firebase';

export const FETCHING_PRICES = 'FETCHING_PRICES';
export const RECEIVE_PRICES = 'RECEIVE_PRICES';
export const FETCHING_LATEST_TRADES = 'FETCHING_LATEST_TRADES';
export const RECEIVE_LATEST_TRADES = 'RECEIVE_LATEST_TRADES';
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

export function refreshExchangeData() {
  return async (dispatch, getState) => {
    const { currentExchange, currentCurrency, currentCrypto } = getState().exchange.info;
    const { currentPeriod, timeframe } = getState().exchange.ohlc;
    dispatch(fetchOhlc(currentExchange, currentCurrency, currentCrypto, currentPeriod, timeframe));
    dispatch(fetchLatestTrades(currentExchange, currentCurrency, currentCrypto));
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

export function fetchLatestTrades(exchangeId, currency, crypto, limit) {
  return async (dispatch) => {
    dispatch({ type: FETCHING_LATEST_TRADES });
    try {
      const result = await fetchLastTrades(exchangeId, currency, crypto, limit);
      dispatch({ type: RECEIVE_LATEST_TRADES, payload: result });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  };
}

export const setFavoritePair = (pair, exchange) => {
  logEvent('favorite_exchange', { pair, exchange });
  return { type: TOGGLE_FAVORITE_EXCHANGE, payload: { pair, exchange } };
};
