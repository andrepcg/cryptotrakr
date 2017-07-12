import { combineReducers } from 'redux';
import { omit, without } from 'lodash';
import { uuid } from '../utils/general';
import { CREATE_ENTRY, DELETE_ENTRY, SPLIT_ENTRY, STACK_ENTRIES, SELL_ENTRY, DELETE_SALE, OPEN_ADD_PROMPT, CLOSE_ADD_PROMPT, ADD_STACK_TO_MERGE } from '../actions/portfolio';

const initialState = {
  portfolio: {
    // id123: {
    //   id: 'id123',
    //   amount: 0.1,
    //   boughtPrice: 123,
    //   currency: 'usd',
    //   crypto: 'eth',
    //   timestamp: new Date().valueOf(),
    //   exchange: 'coinbase',
    //   positionOpened: true,
    //   sellTimestamp: null,
    //   sellPrice: null,
    // },
  },
  addPromptVisible: false,
  stacking: {
    isStacking: false,
    stacksToMerge: [],
    crypto: null,
  },
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

const stackInitialState = () => ({
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
});

function stack(state = stackInitialState(), action) {
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
      if (action.payload.deleteStack) {
        return omit(state, [action.payload.id]);
      } else {
        return { ...state, [action.payload.id]: stack(state[action.payload], action) };
      }
    }

    case DELETE_ENTRY:
      return omit(state, [action.payload]);

    case SPLIT_ENTRY: {
      const { id, newStackAmount } = action.payload;
      const { boughtPrice, currency, crypto, exchange } = state[id];
      const newStack = { ...stackInitialState(), boughtPrice, currency, crypto, exchange, amount: newStackAmount };
      return {
        ...state,
        [id]: stack(state[id], action),
        [newStack.id]: newStack,
      };
    }

    case STACK_ENTRIES: {
      const newEntry = stackEntries(state, action.payload);
      return {
        ...omit(state, action.payload),
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
        ...stackInitialState(),
        id: uuid(),
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

function stacking(state = initialState.stacking, action) {
  switch (action.type) {
    case ADD_STACK_TO_MERGE: {
      let newStack;
      if (state.stacksToMerge.includes(action.payload.id)) {
        newStack = without(state.stacksToMerge, action.payload.id);
      } else {
        newStack = [...state.stacksToMerge, action.payload.id];
      }
      return {
        isStacking: newStack.length > 0,
        stacksToMerge: newStack,
        crypto: action.payload.crypto,
      };
    }

    case STACK_ENTRIES:
      return { ...initialState.stacking };

    default:
      return state;
  }
}

export default combineReducers({
  portfolio,
  addPromptVisible,
  stacking,
});
