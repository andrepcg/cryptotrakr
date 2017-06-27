import React, { PropTypes, Component } from 'react';
import { BackHandler, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';

import firebase, { sendNotificationToken, getNotificationToken } from '../firebase';

import { connectionState } from '../actions/network';
import { userLogin, userLoginSuccess, loginFailed } from '../actions/user';
import { receiveNotification } from '../actions/notifications';
import { fetchPrices } from '../actions/prices';

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
    this.interval = setInterval(this.fetchPricesInterval, 30 * 1000);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
    clearInterval(this.interval);
  }

  setupNotifications() {
    firebase.messaging().onMessage(this.handleNotification);
    firebase.messaging().getInitialNotification().then(this.handleOpenApp);
  }

  fetchPricesInterval = () => {
    const { lastReceiveTime, dispatch } = this.props;
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (((new Date()) - lastReceiveTime) > FIVE_MINUTES) {
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
