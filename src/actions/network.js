export const CHANGE_CONNECTION_STATUS = 'CHANGE_CONNECTION_STATUS';

export const connectionState = (isConnected) => ({ type: 'CHANGE_CONNECTION_STATUS', payload: isConnected });
