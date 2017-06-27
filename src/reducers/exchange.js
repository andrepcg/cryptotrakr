import { RECEIVE_OHLC, FETCHING_OHLC } from '../actions/prices';
import { OPEN_ALERT_PROMPT } from '../actions/alerts';
import { OPEN_EXCHANGE, CHANGE_CURRENCY, CHANGE_PERIOD } from '../actions/exchange';
import { ONE_HOUR, timeframePeriod } from '../utils/timeframes';

const initialState = {
  isFetching: false,
  lastReceiveTime: null,
  ohlc: {},
  currentPeriod: timeframePeriod[ONE_HOUR],
  timeframe: ONE_HOUR,
  currentExchange: '',
  currentCrypto: '',
  currentCurrency: '',
};

export default function exchange(state = initialState, action) {
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

    case CHANGE_PERIOD:
      return {
        ...state,
        currentPeriod: timeframePeriod[action.payload],
        timeframe: action.payload,
      };

    case CHANGE_CURRENCY:
      return {
        ...state,
        currentCurrency: action.payload,
      };

    case FETCHING_OHLC:
      return { ...state, isFetching: true };

    case RECEIVE_OHLC:
      return {
        ...state,
        isFetching: false,
        lastReceiveTime: new Date().getTime(),
        ohlc: { ...state.prices, ...action.payload },
      };

    case OPEN_ALERT_PROMPT: {
      if (action.payload) {
        return { ...state, ...action.payload };
      } else {
        return state;
      }
    }


    default:
      return state;
  }
}
