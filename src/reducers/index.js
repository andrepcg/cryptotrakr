import { combineReducers } from 'redux';

import nav from './navigation';
import settings from './settings';
import prices from './prices';
import alerts from './alerts';
import exchange from './exchange';
import user from './user';
import network from './network';
import portfolio from './portfolio';
import notifications from './notifications';
import app from './app';
import purchases from './purchases';

export default combineReducers({
  nav,
  settings,
  prices,
  alerts,
  exchange,
  user,
  network,
  portfolio,
  notifications,
  app,
  purchases,
});
