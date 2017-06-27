import { combineReducers } from 'redux';
import { omit } from 'lodash';
import { uuid } from '../utils/general';
import { CREATE_ENTRY, DELETE_ENTRY, SPLIT_ENTRY, STACK_ENTRIES, SELL_ENTRY, DELETE_SALE, OPEN_ADD_PROMPT, CLOSE_ADD_PROMPT } from '../actions/portfolio';

const initialState = {
  portfolio: {
    id123: {
      id: 'id123',
      amount: 0.1,
      boughtPrice: 123,
      currency: 'usd',
      crypto: 'eth',
      timestamp: new Date().valueOf(),
      exchange: 'coinbase',
      positionOpened: true,
      sellTimestamp: null,
      sellPrice: null,
    },
  },
  addPromptVisible: false,
};

function stackEntries(portfolio, idsArray) {
  // TODO: check if all stacks are the same crypto
  const firstStack = portfolio[idsArray[0]];
  const amount = idsArray.map(id => portfolio[id].amount).reduce((acc, val) => acc + val, 0);
  return {
    ...firstStack,
    id: uuid(),
    timestamp: new Date().valueOf(),
    amount,
  };
}

const stackInitialState = {
  id: uuid(),
  timestamp: new Date().valueOf(),
  positionOpened: true,
  sellTimestamp: null,
  sellPrice: null,
  // amount: 0.1,
  // boughtPrice: 123,
  // currency: 'usd',
  // crypto: 'eth',
  // exchange: 'coinbase',
};

function stack(state = stackInitialState, action) {
  switch (action.type) {
    case CREATE_ENTRY:
      return { ...state, ...action.payload };

    case SPLIT_ENTRY:
      return { ...state, amount: state.amount - action.payload.newStackAmount };

    case SELL_ENTRY:
      return { ...state, saleId: action.payload.saleId, positionOpened: false };

    case DELETE_SALE:
      return { ...state, sellTimestamp: null, sellPrice: null, positionOpened: true };

    default:
      return state;
  }
}

function portfolio(state = initialState.portfolio, action) {
  switch (action.type) {
    case CREATE_ENTRY: {
      const newStack = stack(undefined, action);
      return { ...state, [newStack.id]: newStack };
    }

    case DELETE_SALE: {
      if (action.payload.deleteSale) {
        return omit(state, [action.payload.id]);
      }
      return { ...state, [action.payload]: stack(state[action.payload], action) };
    }

    case DELETE_ENTRY:
      return omit(state, [action.payload]);

    case SPLIT_ENTRY: {
      const { id, newStackAmount } = action.payload;
      const { boughtPrice, currency, crypto, exchange } = state.portfolio[id];
      const newStack = { ...stackInitialState, boughtPrice, currency, crypto, exchange, amount: newStackAmount };
      return {
        ...state,
        [id]: stack(state.portfolio[id], action),
        [newStack.id]: newStack,
      };
    }

    case STACK_ENTRIES: {
      const newEntry = stackEntries(state.portfolio, action.payload);
      return {
        ...omit(state.portfolio, action.payload),
        [newEntry.id]: newEntry,
      };
    }

    case SELL_ENTRY: {
      const { id, sellPrice, amountSold } = action.payload;
      const { amount } = state[id];
      const shouldSplitStack = amount !== amountSold;
      const sellTimestamp = new Date().valueOf();
      const newStack = {
        ...state[id],
        ...stackInitialState,
        // boughtPrice,
        // currency,
        // crypto,
        // exchange,
        positionOpened: false,
        amount: amountSold,
        sellTimestamp,
        sellPrice,
      };
      const portfolio = shouldSplitStack
        ? { [id]: { ...state[id], amount: amount - amountSold }, [newStack.id]: newStack }
        : { [id]: { ...state[id], positionOpened: false, sellTimestamp, sellPrice } };
      return {
        ...state,
        ...portfolio,
      };
    }

    default:
      return state;
  }
}

function addPromptVisible(state = false, action) {
  switch (action.type) {
    case OPEN_ADD_PROMPT:
      return true;

    case CLOSE_ADD_PROMPT:
    case CREATE_ENTRY:
      return false;

    default:
      return state;
  }
}

export default combineReducers({
  portfolio,
  addPromptVisible,
});
