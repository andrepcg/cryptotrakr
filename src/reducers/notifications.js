import { omit } from 'lodash';

import {
  RECEIVE_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  DELETE_NOTIFICATION,
} from '../actions/notifications';

const initialState = {
  notifications: {},
};

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload.id]: { ...action.payload, read: false },
        },
      };

    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload]: { ...state.notifications[action.payload], read: true },
        },
      };

    case DELETE_NOTIFICATION:
      return omit(state, [`notification.${action.payload}`]);

    default:
      return state;
  }
}
