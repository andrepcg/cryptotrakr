import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';

import analyticsMiddleware from './middlewares/analytics';
import reducer from './reducers';

const manifest = {
  1: state => state,
  2: state => ({ ...state, prices: {} }),
};

const migration = createMigration(manifest, 'app');

export default function configureStore(onPersist) {
  const enhancer = compose(
    applyMiddleware(thunkMiddleware, analyticsMiddleware),
    // migration,
    // autoRehydrate(),
    devTools({
      name: 'crypto-trakr', realtime: true,
    }),
  );

  const store = createStore(reducer, enhancer);

  persistStore(store, { blacklist: ['nav', 'user', 'network'], storage: AsyncStorage }, onPersist);
  return store;
}
