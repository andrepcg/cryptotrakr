import { freeLimits } from '../config';
import { setAlert, editAlert as editAlertFb, removeAlert as removeAlertFb, getAlerts, logEvent } from '../firebase';
import { uuid, showPremiumAlert } from '../utils/general';

export const CREATE_ALERT = 'CREATE_ALERT';
export const CREATE_ALERT_FAILED = 'CREATE_ALERT_FAILED';
export const EDIT_ALERT = 'EDIT_ALERT';
export const EDIT_ALERT_FAILED = 'EDIT_ALERT_FAILED';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const REMOVE_ALERT_FAILED = 'REMOVE_ALERT_FAILED';
export const FETCH_ALERTS = 'FETCH_ALERTS';
export const FETCH_ALERTS_FAILED = 'FETCH_ALERTS_FAILED';
export const FETCH_ALERTS_SUCCESS = 'FETCH_ALERTS_SUCCESS';
export const OPEN_ALERT_PROMPT = 'OPEN_ALERT_PROMPT';
export const CLOSE_ALERT_PROMPT = 'CLOSE_ALERT_PROMPT';

export const openAlertPrompt = (currentExchange, currentCrypto, currentCurrency) => {
  return (dispatch, getState) => {
    const { purchases: { premium }, alerts: { alerts } } = getState();
    if (!premium && Object.keys(alerts).length >= freeLimits.alerts) {
      showPremiumAlert();
    } else {
      if (!currentExchange) {
        dispatch({ type: OPEN_ALERT_PROMPT });
      } else {
        dispatch({ type: OPEN_ALERT_PROMPT, payload: { currentExchange, currentCrypto, currentCurrency } });
      }
    }
  };
};

export const closeAlertPrompt = () => ({ type: CLOSE_ALERT_PROMPT });

export function editAlert(userId, alert) {
  return dispatch => editAlertFb(userId, alert)
    .then(() => dispatch({ type: EDIT_ALERT, payload: alert }));
}

export function createAlert(userId, exchange, currency, crypto, value, isHigher, enabled = true) {
  const alert = { id: uuid(), exchange, currency, crypto, value, isHigher, enabled };
  logEvent('create_alert', { currency, crypto, exchange });
  return dispatch => setAlert(userId, alert)
    .then(() => dispatch({ type: CREATE_ALERT, payload: alert }))
    .catch(() => dispatch({ type: CREATE_ALERT_FAILED, payload: alert }));
}

export function removeAlert(userId, alertId) {
  return dispatch => removeAlertFb(userId, alertId)
    .then(() => dispatch({ type: REMOVE_ALERT, payload: alertId }));
}

export function fetchAlerts(uid) {
  return (dispatch) => {
    dispatch({ type: FETCH_ALERTS });
    getAlerts(uid)
      .then(alerts => dispatch({ type: FETCH_ALERTS_SUCCESS, payload: alerts }))
      .catch(e => dispatch({ type: FETCH_ALERTS_FAILED, payload: e }));
  };
}
