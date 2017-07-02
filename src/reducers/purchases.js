import { PURCHASE_PRODUCT, REMOVE_PURCHASE, PURCHASE_PRODUCTS, REMOVE_PURCHASES } from '../actions/purchases';

import { products } from '../config';

const initialState = products.reduce((acc, p) => { acc[p.id] = false; return acc; }, {});

export default function purchases(state = initialState, action) {
  switch (action.type) {

    case PURCHASE_PRODUCT:
      return { ...state, [action.payload]: true };

    case PURCHASE_PRODUCTS:
      return action.payload.reduce((acc, productId) => {
        acc[productId] = true;
        return acc;
      }, { ...initialState });

    case REMOVE_PURCHASES:
      return action.payload.reduce((acc, productId) => {
        acc[productId] = false;
        return acc;
      }, { ...state });

    case REMOVE_PURCHASE:
      return { ...state, [action.payload]: false };

    default:
      return state;
  }
}
