import { NavigationActions } from 'react-navigation';
import { OPEN_EXCHANGE } from '../actions/exchange';
import { OPEN_PREMIUM_SCREEN } from '../actions/purchases';

import AppNavigator from '../navigators/AppNavigator';


export default function nav(state, action) {
  let nextState;
  switch (action.type) {
    case OPEN_EXCHANGE: {
      const navigationAction = NavigationActions.navigate({
        routeName: 'Exchange',
        params: {
          exchangeName: action.payload.name,
          crypto: action.payload.crypto,
          currency: action.payload.currency,
        },
      });

      return AppNavigator.router.getStateForAction(navigationAction, state);
    }

    case OPEN_PREMIUM_SCREEN: {
      const navigationAction = NavigationActions.navigate({
        routeName: 'Premium',
      });

      return AppNavigator.router.getStateForAction(navigationAction, state);
    }

    case 'TOGGLE_DRAWER': {
      const a = {
        type: 'Navigation/NAVIGATE',
        routeName: state.routes[0].index === 0 ? 'DrawerOpen' : 'DrawerClose',
      };
      return AppNavigator.router.getStateForAction(a, state);
    }

    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
