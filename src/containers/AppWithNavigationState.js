import React, { PropTypes, Component } from 'react';
import { BackHandler, NetInfo, Platform } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import Billing from 'react-native-billing';

import firebase, { sendNotificationToken, getNotificationToken } from '../firebase';
import { FETCH_PRICES_INTERAVL } from '../config';

import { connectionState } from '../actions/network';
import { userLogin, userLoginSuccess, loginFailed } from '../actions/user';
import { receiveNotification } from '../actions/notifications';
import { fetchPrices } from '../actions/prices';
import { purchaseProducts } from '../actions/purchases';

import AppNavigator from '../navigators/AppNavigator';


@connect(({ nav, prices: { lastReceiveTime } }) => ({ nav, lastReceiveTime }))
export default class AppWithNavigationState extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
    userLogin: PropTypes.func,
    userLoginSuccess: PropTypes.func,
    loginFailed: PropTypes.func,
    lastReceiveTime: PropTypes.number,
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props;
      if (nav.index === 0) return false;
      dispatch(NavigationActions.back());
      return true;
    });
    NetInfo.isConnected.fetch().then(this._handleConnectionChange);
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
    this.authFirebase();
    this.setupNotifications();
    this.fetchPricesInterval();
    this.syncPurchases();
    this.interval = setInterval(this.fetchPricesInterval, 30 * 1000);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
    clearInterval(this.interval);
  }

  setupNotifications() {
    // firebase.messaging().onMessage(this.handleNotification);
    firebase.messaging().getInitialNotification().then(this.handleOpenApp);
  }

  syncPurchases = async () => {
    if (!__DEV__ && Platform.OS === 'android') {
      await Billing.close();
      try {
        await Billing.open();
        await Billing.loadOwnedPurchasesFromGoogle();
        const purchases = await Billing.listOwnedProducts();
        console.log('Purchases', purchases);
        if (purchases && purchases.length > 0) {
          this.props.dispatch(purchaseProducts(purchases));
        }
      } catch (err) {
        console.error(err);
      } finally {
        await Billing.close();
      }
    }
  }

  fetchPricesInterval = () => {
    const { lastReceiveTime, dispatch } = this.props;
    if (!lastReceiveTime || ((new Date()) - lastReceiveTime) > FETCH_PRICES_INTERAVL) {
      dispatch(fetchPrices());
    }
  }

  authFirebase() {
    const { dispatch } = this.props;
    dispatch(userLogin());
    firebase.auth().signInAnonymously()
      .then((user) => {
        dispatch(userLoginSuccess(user));
        firebase.analytics().setUserId(user.uid);
        getNotificationToken().then(token => sendNotificationToken(user.uid, token));
        firebase.messaging().onTokenRefresh(token => sendNotificationToken(user.uid, token));
      }).catch(err => dispatch(loginFailed(err)));
  }

  handleNotification = (notification) => {
    /*
      { opened_from_tray, lastPrice, alertId }
    */
    const { lastPrice, alertId, opened_from_tray } = notification;
    receiveNotification(
      notification['gcm.message_id'],
      notification['google.c.a.ts'] * 1000, // sent time
      { lastPrice, alertId, opened_from_tray },
    );
    console.log("Received notification", notification);
  }

  handleOpenApp = (notification) => {
    console.log(notification);
  }

  _handleConnectionChange = isConnected => this.props.dispatch(connectionState(isConnected));

  render() {
    const { dispatch, nav } = this.props;
    return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;
  }
}
