import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Switch, Text, Picker } from 'react-native';
import { connect } from 'react-redux';
import currencySymbol from 'currency-symbol-map';
import RNRestart from 'react-native-restart';

import { setCurrency, setLocale } from '../actions/settings';
import I18n from '../translations';

import Button from '../components/Button';

import { currencies, languages } from '../config';

@connect(
  ({ settings: { defaultCurrency, locale } }) => ({ defaultCurrency, locale }),
  { setCurrency, setLocale },
)
export default class Settings extends PureComponent {
  static propTypes = {
    defaultCurrency: PropTypes.string,
    locale: PropTypes.string,
    setCurrency: PropTypes.func,
    setLocale: PropTypes.func,
  };

  static defaultProps = {
    notificationExchangeId: '',
    currency: 'usd',
  };

  static navigationOptions = () => ({
    title: 'Settings',
  });

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      RNRestart.Restart();
    }
  }

  render() {
    const { defaultCurrency, setCurrency, locale, setLocale } = this.props;
    return (
      <View style={styles.container}>
        {/*<Button onPress={this.handleNotificationToggle} >
          <View style={styles.settingsEntry}>
            <View>
              <Text style={styles.settingTitle}>Persistent Price Notification</Text>
              <Text style={styles.settingSubTitle}>Ongoing notification with up to date price</Text>
            </View>
            <View>
              <Switch
                value={persistentNotification}
                onValueChange={this.handleNotificationToggle}
              />
            </View>
          </View>
        </Button>*/}

        <View style={styles.picker}>
          <View>
            <Text style={styles.settingTitle}>Language</Text>
          </View>
          <View>
            <Picker selectedValue={locale} onValueChange={setLocale}>
              {Object.values(languages).map(e =>
                <Picker.Item key={e.name} label={e.name} value={e.id} />,
              )}
            </Picker>
          </View>
        </View>

        <View style={styles.picker}>
          <View>
            <Text style={styles.settingTitle}>{I18n.t('settingsP.defaultCurrency')}</Text>
            <Text style={styles.settingSubTitle}>{I18n.t('settingsP.defaultCurrencySub')}</Text>
          </View>
          <View>
            <Picker selectedValue={defaultCurrency} onValueChange={setCurrency}>
              {Object.values(currencies).map(e =>
                <Picker.Item key={e.name} label={`${e.name} ${currencySymbol(e.id)}`} value={e.id} />,
              )}
            </Picker>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  settingsEntry: {
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
  settingTitle: {
    color: 'black',
    fontSize: 15,
  },
  settingSubTitle: {
    fontSize: 12,
  },
});

