import { SET_CURRENCY, SET_LOCALE } from '../actions/settings';

const initialState = {
  delimiters: {
    thousands: ' ',
    decimal: ',',
  },
  defaultCurrency: 'eur',
  locale: 'en',
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY:
      return { ...state, defaultCurrency: action.payload };

    case SET_LOCALE:
      return { ...state, locale: action.payload };

    default:
      return state;
  }
}
