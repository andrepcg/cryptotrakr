export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const USER_LOGIN_PENDING = 'USER_LOGIN_PENDING';
export const SET_NOTIFICATION_TOKEN = 'SET_NOTIFICATION_TOKEN';

export const userLogin = () =>
  ({ type: USER_LOGIN_PENDING });

export const userLoginSuccess = user =>
  ({ type: USER_LOGIN_SUCCESS, payload: user });

export const loginFailed = err =>
  ({ type: USER_LOGIN_ERROR, payload: err });

export const setNotificationToken = token =>
  ({ type: SET_NOTIFICATION_TOKEN, payload: token });
