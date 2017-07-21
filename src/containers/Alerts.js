import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Switch, Text, Alert, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { debounce, find, toUpper } from 'lodash';

import currencySymbol from 'currency-symbol-map';
import numeral from 'numeral';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createAlert, editAlert, removeAlert, fetchAlerts } from '../actions/alerts';
import { Banner, buildRequest } from '../firebase';
import I18n from '../translations';

import Button from '../components/Button';
import { exchanges } from '../config';
import { darkHeader } from '../styles';

const showInfo = () => {
  Alert.alert(
    'Alerts information',
    'You\'ll receive a notification when the set price is reached.\n\nPull to refresh.\n\nHold alert to remove',
  );
};

@connect(({
  purchases: { noads, premium },
  alerts: { alerts, isLoading },
  user: { uid },
}) => ({ alerts, isLoading, uid, isPremium: premium, noAds: noads }),
  { createAlert, editAlert, removeAlert, fetchAlerts },
)
export default class Alerts extends PureComponent {
  static navigationOptions = {
    title: I18n.t('alerts'),
    ...darkHeader,
    headerRight: <Button touchableOpacity onPressFunc={showInfo}>
      <Icon name="help-circle" size={30} color="#fff" style={{ padding: 10 }} />
    </Button>,
    headerTruncatedBackTitle: null,
    headerBackTitle: null,
  };

  static propTypes = {
    alerts: PropTypes.object,
    uid: PropTypes.string,
    createAlert: PropTypes.func,
    editAlert: PropTypes.func,
    removeAlert: PropTypes.func,
    fetchAlerts: PropTypes.func,
    isLoading: PropTypes.bool,
    isPremium: PropTypes.bool,
    noAds: PropTypes.bool,
  };

  static defaultProps = {
    alerts: {},
  };

  componentDidMount() {
    this.fetchUserAlerts();
  }

  fetchUserAlerts = () => {
    const { uid, fetchAlerts } = this.props;
    fetchAlerts(uid);
  }

  handleAlertToggle = debounce(
    (id) => {
      const { editAlert, uid, alerts } = this.props;
      const alert = alerts[id];
      editAlert(uid, { ...alert, enabled: !alert.enabled }).catch(this.showError);
    },
    500,
    { leading: true, trailing: false },
  )

  showError = (e) => {
    Alert.alert(
      I18n.t('alertsContainer.alertError'),
      e,
      [{ text: 'OK' }],
    );
  }

  removeAlert = (id) => {
    const { removeAlert, uid } = this.props;
    Alert.alert(
      I18n.t('alertsContainer.removeAlertTitle'),
      I18n.t('alertsContainer.removeAlertConfirmation'),
      [
        { text: I18n.t('cancel'), style: 'cancel' },
        {
          text: I18n.t('remove'),
          onPress: () => removeAlert(uid, id).catch(this.showError),
        },
      ],
    );
  }

  renderAlert = ({ item }) => {
    const { id, exchange, value, currency, crypto, isHigher, enabled } = item;
    const exhangeName = find(exchanges, { id: exchange }).name;
    return (
      <Button key={id} onLongPressFunc={() => this.removeAlert(id)}>
        <View style={styles.alertsEntry}>
          <View>
            <Text style={styles.alertTitle}>{exhangeName} {toUpper(`${crypto}/${currency}`)}</Text>
            <Text style={styles.alertSubtitle}>
              {`${I18n.t('alertsContainer.alertWhen')} ${isHigher ? '≥' : '≤'} ${currencySymbol(currency)}${numeral(value).format('0,0.00')}`}
            </Text>
          </View>
          <View>
            <Switch
              value={enabled}
              onValueChange={() => this.handleAlertToggle(id)}
            />
          </View>
        </View>
      </Button>
    );
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>{I18n.t('alertsContainer.noalerts')}</Text>
      </View>
    );
  }

  render() {
    const { alerts, isLoading, isPremium, noAds } = this.props;

    const alertsList = Object.values(alerts);

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          onRefresh={this.fetchUserAlerts}
          refreshing={isLoading}
          data={alertsList}
          keyExtractor={item => item.id}
          numColumns={1}
          renderItem={this.renderAlert}
          ListEmptyComponent={this.renderEmpty}
        />
        {!isPremium && !noAds &&
          <Banner
            unitId="ca-app-pub-3886797449668157/4225712378"
            request={buildRequest().build()}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  alertsList: {
    flexDirection: 'column',
  },
  alertsEntry: {
    borderColor: '#d6d5d9',
    borderBottomWidth: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    borderColor: '#d6d5d9',
    borderBottomWidth: 1,
    padding: 20,
  },
  alertTitle: {
    color: 'black',
    fontSize: 15,
  },
  alertSubtitle: {
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});

