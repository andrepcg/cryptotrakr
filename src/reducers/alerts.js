import { omit } from 'lodash';

import {
  CREATE_ALERT,
  CREATE_ALERT_FAILED,
  EDIT_ALERT,
  EDIT_ALERT_FAILED,
  REMOVE_ALERT,
  REMOVE_ALERT_FAILED,
  FETCH_ALERTS,
  FETCH_ALERTS_SUCCESS,
  FETCH_ALERTS_FAILED,
  OPEN_ALERT_PROMPT,
  CLOSE_ALERT_PROMPT,
} from '../actions/alerts';

const initialState = {
  isLoading: false,
  alertPromptOpen: false,
  alerts: {},
};

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case OPEN_ALERT_PROMPT:
      return { ...state, alertPromptOpen: true };

    case CREATE_ALERT:
    case CLOSE_ALERT_PROMPT:
      return { ...state, alertPromptOpen: false };

    case FETCH_ALERTS:
      return { ...state, isLoading: true };

    case FETCH_ALERTS_FAILED:
      return { ...state, isLoading: false };

    case FETCH_ALERTS_SUCCESS:
      return { ...state, isLoading: false, alerts: { ...action.payload } };

    case EDIT_ALERT:
      return {
        ...state,
        alerts: {
          ...state.alerts,
          [action.payload.id]: { ...action.payload },
        },
      };

    case REMOVE_ALERT:
      return omit(state, [`alerts.${action.payload}`]);

    default:
      return state;
  }
}
