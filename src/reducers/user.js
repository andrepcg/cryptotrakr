import { USER_LOGIN_SUCCESS, USER_LOGIN_ERROR, USER_LOGIN_PENDING } from '../actions/user';

const initialState = {
  isLoggingIn: false,
  isLoggedin: false,
  uid: null,
  loginFailed: false,
  error: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_PENDING:
      return {
        ...state,
        isLoggingIn: true,
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedin: true,
        ...action.payload._user,
      };

    case USER_LOGIN_ERROR:
      return {
        ...state,
        loginFailed: true,
        error: action.payload,
      };

    default:
      return state;
  }
}
