import { Platform } from 'react-native';
import RNFirebase from 'react-native-firebase';

const configurationOptions = {
  debug: false,
};

const firebase = RNFirebase.initializeApp(configurationOptions);

export default firebase;


if (Platform.OS === 'ios') {
  firebase.messaging().requestPermissions();
}

firebase.admob().initialize('ca-app-pub-3886797449668157~1272245972');

if (__DEV__) {
  firebase.analytics().setAnalyticsCollectionEnabled(false);
  firebase.crash().setCrashCollectionEnabled(false);
}

export function sendNotificationToken(userId, token) {
  return firebase.database()
    .ref(`users/${userId}`)
    .set({ token });
}

export function setAlert(userId, alert) {
  return firebase.database()
    .ref(`alerts/${userId}/${alert.id}`)
    .set(alert);
}

export function editAlert(userId, alert) {
  return firebase.database()
    .ref(`alerts/${userId}/${alert.id}`)
    .update(alert);
}

export function removeAlert(userId, alertId) {
  return firebase.database()
    .ref(`alerts/${userId}/${alertId}`)
    .set(null);
}

export function getAlerts(userId) {
  return firebase.database()
    .ref(`alerts/${userId}`)
    .once('value')
    .then(v => v.val());
}

export function getNotificationToken() {
  return firebase.messaging().getToken();
}

export function logEvent(name, data) {
  firebase.analytics().logEvent(name, data);
}

export const Banner = firebase.admob.Banner;
export const AdRequest = firebase.admob.AdRequest;

export const buildRequest = () => {
  const request = new AdRequest();
  request.addKeyword('cryptocurrency').addKeyword('bitcoin').addKeyword('ethereum').addKeyword('stocks').addKeyword('trading');
  return request;
};
