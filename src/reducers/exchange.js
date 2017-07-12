import { combineReducers } from 'redux';

import { RECEIVE_OHLC, FETCHING_OHLC, FETCHING_LATEST_TRADES, RECEIVE_LATEST_TRADES } from '../actions/prices';
import { OPEN_ALERT_PROMPT } from '../actions/alerts';
import { OPEN_EXCHANGE, CHANGE_PERIOD } from '../actions/exchange';
import { ONE_HOUR, timeframePeriod } from '../utils/timeframes';

const initialState = {
  currentExchange: '',
  currentCrypto: '',
  currentCurrency: '',
};

function info(state = initialState, action) {
  switch (action.type) {
    case OPEN_EXCHANGE: {
      if (
        state.currentExchange !== action.payload.exchangeId ||
        state.currentCurrency !== action.payload.currency ||
        state.currentCrypto !== action.payload.crypto
      ) {
        return {
          ...initialState,
          currentExchange: action.payload.exchangeId,
          currentCurrency: action.payload.currency,
          currentCrypto: action.payload.crypto,
        };
      }
      return state;
    }

    case OPEN_ALERT_PROMPT: {
      if (action.payload) {
        return { ...state, ...action.payload };
      }
      return state;
    }

    default:
      return state;
  }
}

const ohlcInitialState = {
  data: {},
  lastReceiveTime: null,
  isFetching: false,
  currentPeriod: timeframePeriod[ONE_HOUR],
  timeframe: ONE_HOUR,
};

function ohlc(state = ohlcInitialState, action) {
  switch (action.type) {
    case OPEN_EXCHANGE:
      return { ...ohlcInitialState };

    case CHANGE_PERIOD:
      return {
        ...state,
        currentPeriod: timeframePeriod[action.payload],
        timeframe: action.payload,
      };

    case FETCHING_OHLC:
      return { ...state, isFetching: true };

    case RECEIVE_OHLC:
      return {
        ...state,
        isFetching: false,
        lastReceiveTime: new Date().getTime(),
        data: { ...action.payload },
      };

    default:
      return state;
  }
}

function lastTrades(state = { data: [], lastReceiveTime: null, isFetching: false }, action) {
  switch (action.type) {
    case OPEN_EXCHANGE:
      return { data: [], lastReceiveTime: null, isFetching: false };

    case FETCHING_LATEST_TRADES:
      return { ...state, isFetching: true };

    case RECEIVE_LATEST_TRADES:
      return {
        ...state,
        isFetching: false,
        lastReceiveTime: new Date().getTime(),
        data: action.payload,
      };

    default:
      return state;
  }
}

export default combineReducers({
  info,
  ohlc,
  lastTrades,
});
