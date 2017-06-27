// import { startBackgroundPriceUpdater, cancelTask } from '../utils/backgroundTasks';

export const TOGGLE_ACTIVE_NOTIFICATION = 'TOGGLE_ACTIVE_NOTIFICATION';
export const SET_NOTIFICATION_EXCHANGE = 'SET_NOTIFICATION_EXCHANGE';

export const toggleActiveNotification = (on, exchange) => {
  // if (on) startBackgroundPriceUpdater(exchange);
  // else cancelTask();

  return { type: TOGGLE_ACTIVE_NOTIFICATION, payload: on };
};

export const setNotificationExchange = exchangeId =>
  ({ type: SET_NOTIFICATION_EXCHANGE, exchangeId });
