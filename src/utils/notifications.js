// import PushNotification from 'react-native-push-notification';
// import numeral from 'numeral';
// import moment from 'moment';
// import { round } from 'lodash';

// export function configureNotifications(onRegister, onNotification) {
//   if (!onRegister && !onNotification) return;
//   PushNotification.configure({
//     onRegister, // (token) => {}
//     onNotification, // (notification) => {}
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//     popInitialNotification: true,
//     requestPermissions: true,
//     senderID: '960092745241',
//   });
// }

// export function disablePersistentNotification() {
//   PushNotification.cancelAllLocalNotifications();
// }

// export function updatePersistentNotification(last, high, low, volume, changePercent, exchangeName) {
//   const androidSettings = {
//     id: '0',
//     autoCancel: false,
//     largeIcon: 'ic_launcher',
//     smallIcon: 'ic_launcher',
//     // bigText: 'My big text that will be shown when notification is expanded',
//     subText: exchangeName,
//     ongoing: true,
//     vibrate: false,
//   };

//   const time = moment().format('h:mm:ss a');

//   PushNotification.localNotification({
//     ...androidSettings,
//     // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
//     title: `Last price: ${numeral(last).format('$0,0.00')} (${changePercent > 0 ? '+' : ''}${round(changePercent * 100, 1)}%) - ${time}`,
//     message: `High: ${numeral(high).format('$0,0.00')} | Low: ${numeral(low).format('$0,0.00')} | Volume: ${numeral(volume).format('0a')}`,
//     playSound: false,
//   });
// }
