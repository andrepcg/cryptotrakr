import { showPremiumAlert } from '../utils/general';
import { freeLimits } from '../config';

export const CREATE_ENTRY = 'CREATE_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';
export const DELETE_SALE = 'DELETE_SALE';
export const SPLIT_ENTRY = 'SPLIT_ENTRY';
export const STACK_ENTRIES = 'STACK_ENTRIES';
export const SELL_ENTRY = 'SELL_ENTRY';
export const OPEN_ADD_PROMPT = 'OPEN_ADD_PROMPT';
export const CLOSE_ADD_PROMPT = 'CLOSE_ADD_PROMPT';
export const ADD_STACK_TO_MERGE = 'ADD_STACK_TO_MERGE';

export const create = (amount, boughtPrice, currency, crypto, exchange) => ({
  type: CREATE_ENTRY,
  payload: { amount, boughtPrice, currency, crypto, exchange },
});

export const deleteEntry = id => ({ type: DELETE_ENTRY, payload: id });

export const deleteSale = (id, deleteStack = false) =>
  ({ type: DELETE_SALE, payload: { id, deleteStack } });

export const split = (id, newStackAmount) =>
  ({ type: SPLIT_ENTRY, payload: { id, newStackAmount } });

export const stack = idsArray => ({ type: STACK_ENTRIES, payload: idsArray });

export const sell = (id, amountSold, sellPrice) =>
  ({ type: SELL_ENTRY, payload: { id, sellPrice, amountSold } });

export const openAddPrompt = () => (dispatch, getState) => {
  const { purchases: { premium }, portfolio: { portfolio } } = getState();
  if (!premium && Object.keys(portfolio).length >= freeLimits.portfolio) {
    showPremiumAlert(dispatch);
  } else {
    dispatch({ type: OPEN_ADD_PROMPT });
  }
};

export const closeAddPrompt = () => ({ type: CLOSE_ADD_PROMPT });

export const addStackToMerge = (id, crypto) =>
  ({ type: ADD_STACK_TO_MERGE, payload: { id, crypto } });
