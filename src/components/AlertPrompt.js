import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TextInput, Platform, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import currencySymbol from 'currency-symbol-map';
import { toUpper, find, get } from 'lodash';

import { exchanges, freeLimits } from '../config';
import Prompt from './Prompt';
import I18n from '../translations';

import { createAlert, closeAlertPrompt } from '../actions/alerts';

const newAlertOptions = [
  { label: I18n.t('higher'), value: true },
  { label: I18n.t('lower'), value: false },
];

@connect(({
  alerts: { alertPromptOpen, alerts },
  exchange: { info: { currentCrypto, currentCurrency, currentExchange } },
  prices: { markets },
  user: { uid },
}) => ({ visible: alertPromptOpen, currency: currentCurrency, crypto: currentCrypto, exchangeId: currentExchange, markets, uid }),
  { createAlert, closeAlertPrompt },
)
export default class AlertPrompt extends PureComponent {
  static propTypes = {
    lastPrice: PropTypes.number,
    currency: PropTypes.string,
    crypto: PropTypes.string,
    exchangeId: PropTypes.string,
    visible: PropTypes.bool,
    closeAlertPrompt: PropTypes.func,
    createAlert: PropTypes.func,
    markets: PropTypes.object,
    uid: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    lastPrice: 0,
  };

  state = this.clearState();

  clearState() {
    return {
      newAlertPriceValue: '',
      newAlertHigherValue: 1,
    };
  }

  handleNewAlertValueChange = (newAlertPriceValue) => {
    this.setState({ newAlertPriceValue });
  }

  handleCreateAlert = () => {
    const { uid, exchangeId, crypto, currency, createAlert } = this.props;
    const { newAlertPriceValue, newAlertHigherValue } = this.state;
    if (!isNaN(newAlertPriceValue)) {
      createAlert(uid, exchangeId, currency, crypto, newAlertPriceValue, newAlertHigherValue).then(() => {
        if (Platform.OS === 'android') ToastAndroid.show('Alert created!', ToastAndroid.SHORT);
        this.setState(this.clearState());
      });
    }
  }

  getLastPrice() {
    const { exchangeId, crypto, currency, markets, lastPrice } = this.props;
    return get(markets, `[${crypto}${currency}][${exchangeId}].price.last`, lastPrice);
  }

  getExchangeName() {
    const { exchangeId } = this.props;
    return get(find(exchanges, { id: exchangeId }), 'name', '');
  }

  renderLoggedIn() {
    const { currency, crypto } = this.props;
    const { newAlertPriceValue } = this.state;
    return (
      <View>
        <Text>{I18n.t('alertTooltip')}</Text>
        <RadioForm
          radio_props={newAlertOptions}
          formHorizontal
          initial={0}
          onPress={value => this.setState({ newAlertHigherValue: value })}
          style={styles.alertRadioForm}
        />
        <View style={styles.alertInline}>
          <Text>{I18n.t('than')}</Text>
          <TextInput
            placeholder={String(this.getLastPrice())}
            onChangeText={this.handleNewAlertValueChange}
            style={styles.alertTextInput}
            keyboardType="numeric"
            value={newAlertPriceValue}
            maxLength={7}
          />
          <Text>{currencySymbol(currency)}/{toUpper(crypto)}</Text>
        </View>
        <Text>{I18n.t('on')} <Text style={styles.bold}>{this.getExchangeName()}</Text></Text>
      </View>
    );
  }

  render() {
    const { visible, closeAlertPrompt, uid } = this.props;
    return (
      <Prompt
        visible={visible}
        close={closeAlertPrompt}
        title={I18n.t('createAlert')}
        options={[{ label: I18n.t('cancel'), type: 'cancel' }, { label: I18n.t('create'), onPress: this.handleCreateAlert }]}
      >
        {!uid && <Text>{I18n.t('notLoggedIn')}</Text>}
        {uid && this.renderLoggedIn()}
      </Prompt>
    );
  }
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: '900',
  },
  alertRadioForm: {
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  alertInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTextInput: {
    width: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});
