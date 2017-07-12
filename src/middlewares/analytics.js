import firebase, { logEvent } from '../firebase';

const analyticsMiddleware = store => next => (action) => {
  switch (action.type) {
    case 'Navigation/NAVIGATE': {
      firebase.analytics().setCurrentScreen(action.routeName);
      break;
    }

    case 'PURCHASE_PRODUCT': {
      logEvent('purchase_product', { id: action.payload });
      break;
    }

    case 'CREATE_ENTRY': {
      logEvent('portfolio_create');
      break;
    }

    case 'SELL_ENTRY': {
      logEvent('portfolio_sell');
      break;
    }

    case 'SPLIT_ENTRY': {
      logEvent('portfolio_split');
      break;
    }

    default:
      break;
  }

  return next(action);
};

export default analyticsMiddleware;
