import { without } from 'lodash';
import { RECEIVE_PRICES, FETCHING_PRICES, TOGGLE_FAVORITE_EXCHANGE } from '../actions/prices';


const initialState = {
  isFetching: false,
  lastReceiveTime: null,
  markets: {
  },
  // exchanges: importExchanges(),
  favoritePairs: {
    ethusd: ['kraken', 'coinbase'],
  },
};

function normalizeExchanges(exchanges) {
  const normalized = {};
  for (const [key, value] of Object.entries(exchanges)) {
    if (value.volume !== 0) {
      const [exchangeId, market] = key.split(':'); // coinbase : ethusd
      if (normalized.hasOwnProperty(market)) {
        normalized[market][exchangeId] = value;
      } else {
        normalized[market] = { [exchangeId]: value };
      }
    }
  }
  return normalized;
}

export default function prices(state = initialState, action) {
  switch (action.type) {
    case FETCHING_PRICES:
      return { ...state, isFetching: true };

    case RECEIVE_PRICES:
      return {
        ...state,
        isFetching: false,
        lastReceiveTime: new Date().getTime(),
        markets: normalizeExchanges(action.payload),
      };

    case TOGGLE_FAVORITE_EXCHANGE: {
      const { pair, exchange } = action.payload;
      const actualFavs = state.favoritePairs[pair] || [];
      const isFavorite = actualFavs.includes(exchange);
      const favoritePairs = isFavorite
        ? { ...state.favoritePairs, [pair]: without(actualFavs, exchange) }
        : { ...state.favoritePairs, [pair]: [...actualFavs, exchange] };
      return {
        ...state,
        favoritePairs,
      };
    }

    default:
      return state;
  }
}
