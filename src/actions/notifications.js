export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

export const receiveNotification = (id, sentTime, data) =>
  ({ type: RECEIVE_NOTIFICATION, payload: { id, sentTime, receiveTime: new Date(), data } });

export const deleteNotification = nofiticationId =>
  ({ type: DELETE_NOTIFICATION, payload: nofiticationId });

export const markAsRead = nofiticationId =>
  ({ type: MARK_NOTIFICATION_READ, payload: nofiticationId });
