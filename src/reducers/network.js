import { CHANGE_CONNECTION_STATUS } from '../actions/network';

const initialState = {
  isConnected: false,
};

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };

    default:
      return state;
  }
}
