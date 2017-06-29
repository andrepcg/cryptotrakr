import { PURCHASE_PRODUCT, REMOVE_PURCHASE } from '../actions/purchases';

import { products } from '../config';

const initialState = products.reduce((acc, p) => { acc[p.id] = false; return acc; }, {});

export default function purchases(state = initialState, action) {
  switch (action.type) {

    case PURCHASE_PRODUCT:
      return { ...state, [action.payload]: true };

    case REMOVE_PURCHASE:
      return { ...state, [action.payload]: false };

    default:
      return state;
  }
}
