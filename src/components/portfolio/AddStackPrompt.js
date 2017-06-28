import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TextInput, Picker, Platform, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';
import currencySymbol from 'currency-symbol-map';
import { toUpper, find, round, clamp } from 'lodash';

import { exchanges, cryptos, currencies } from '../../config';
import Button from '../Button';
import Prompt from '../Prompt';
import { openAddPrompt, create, closeAddPrompt } from '../../actions/portfolio';

const cryptosActionSheetOptions = [...cryptos.map(c => c.name), 'Cancel'];
const currenciesActionSheetOptions = [...currencies.map(c => c.name), 'Cancel'];
const exchangesActionSheetOptions = [...exchanges.map(c => c.name), 'Cancel'];

@connect(({
  portfolio: { addPromptVisible },
}) => ({ visible: addPromptVisible }),
  { openAddPrompt, create, closeAddPrompt },
)
export default class AddStackPrompt extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    openAddPrompt: PropTypes.func,
    closeAddPrompt: PropTypes.func,
    create: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };

  state = this.clearState();

  clearState() {
    return {
      StackAmount: 0,
      BoughtPrice: 0,
      editing: false,
      editingPrice: false,
      tempStackAmount: 0,
      tempBoughtPrice: '',
      currency: 'usd',
      crypto: 'eth',
      exchange: exchanges[0].id,
    };
  }

  handleNewAmountChange = (StackAmount) => {
    this.setState({ tempStackAmount: StackAmount });
  }

  handleStackAmountInputEnd = () => {
    const { tempStackAmount, editing } = this.state;
    if (editing) {
      const newStackAmount = Number(String(tempStackAmount).replace(',', '.')) || 0;
      this.setState({ StackAmount: clamp(newStackAmount, 0.0001, 99999999), editing: false });
    }
  }

  handleBoughtPriceInputEnd = () => {
    const { tempBoughtPrice, editingPrice } = this.state;
    if (editingPrice) {
      const newBoughtPrice = Number(String(tempBoughtPrice).replace(',', '.')) || 0;
      this.setState({ BoughtPrice: clamp(newBoughtPrice, 0.0001, 9999999), editingPrice: false });
    }
  }

  handleBoughtPriceChange = (tempBoughtPrice) => {
    this.setState({ tempBoughtPrice });
  }

  handleCreate = () => {
    const { StackAmount, BoughtPrice, currency, crypto, tempBoughtPrice, exchange, tempStackAmount } = this.state;
    const amount = StackAmount || Number(String(tempStackAmount).replace(',', '.'));
    const price = BoughtPrice || Number(String(tempBoughtPrice).replace(',', '.'));
    if (amount && price) {
      this.props.create(amount, price, currency, crypto, exchange);
    }
  }

  openCryptoActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: cryptosActionSheetOptions,
      cancelButtonIndex: cryptosActionSheetOptions.length - 1,
      title: 'Choose a cryptocurrency',
    }, (index) => {
      if (index !== cryptosActionSheetOptions.length - 1) {
        this.setState({ crypto: cryptos[index].id });
      }
    });
  }

  renderCryptoPicker() {
    const { crypto } = this.state;
    if (Platform.OS === 'android') {
      return (
        <Picker
          style={{ width: 100 }}
          selectedValue={crypto}
          onValueChange={crypto => this.setState({ crypto })}
          mode="dropdown"
        >
          {cryptos.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
        </Picker>
      );
    }
    else {
      return (
        <Button onPressFunc={this.openCryptoActionSheet}>
          <Text>{toUpper(crypto)}</Text>
        </Button>
      );
    }
  }

  openCurrenciesActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: currenciesActionSheetOptions,
      cancelButtonIndex: currenciesActionSheetOptions.length - 1,
      title: 'Choose a currency',
    }, (index) => {
      if (index !== currenciesActionSheetOptions.length - 1) {
        this.setState({ currency: currencies[index].id });
      }
    });
  }

  renderCurrencyPicker() {
    const { currency } = this.state;
    if (Platform.OS === 'android') {
      return (
        <Picker
          style={{ width: 100 }}
          selectedValue={currency}
          onValueChange={currency => this.setState({ currency })}
          mode="dropdown"
        >
          {currencies.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
        </Picker>
      );
    }
    else {
      return (
        <Button onPressFunc={this.openCurrenciesActionSheet}>
          <Text>{toUpper(currency)}</Text>
        </Button>
      );
    }
  }

  openExchangesActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: exchangesActionSheetOptions,
      cancelButtonIndex: exchangesActionSheetOptions.length - 1,
      title: 'Choose an exchange',
    }, (index) => {
      if (index !== exchangesActionSheetOptions.length - 1) {
        this.setState({ exchange: exchanges[index].id });
      }
    });
  }

  renderExchangePicker() {
    const { exchange } = this.state;
    if (Platform.OS === 'android') {
      return (
        <Picker
          style={{ width: 150 }}
          selectedValue={exchange}
          onValueChange={exchange => this.setState({ exchange })}
          mode="dropdown"
        >
          {exchanges.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
        </Picker>
      );
    }
    else {
      return (
        <Button onPressFunc={this.openExchangesActionSheet}>
          <Text>{find(exchanges, { id: exchange }).name}</Text>
        </Button>
      );
    }
  }

  render() {
    const { visible, closeAddPrompt } = this.props;
    const { StackAmount, editing, editingPrice, tempStackAmount, tempBoughtPrice, BoughtPrice } = this.state;
    // const upperCrypto = toUpper(crypto);

    return (
      <Prompt
        visible={visible}
        close={closeAddPrompt}
        title="Create portfolio stack"
        options={[{ label: 'Cancel' }, { label: 'Create', onPress: this.handleCreate }]}
      >
        <View style={styles.inputInline}>
          <Text style={styles.bold}>Amount:</Text>
          <TextInput
            onEndEditing={this.handleStackAmountInputEnd}
            style={styles.alertTextInput}
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'default'}
            maxLength={10}
            onChange={() => this.setState({ editing: true })}
            onChangeText={this.handleNewAmountChange}
            value={editing ? tempStackAmount : String(StackAmount)}
            returnKeyType="done"
          />
          {this.renderCryptoPicker()}
        </View>

        <View style={styles.inputInline}>
          <Text style={styles.bold}>Market price:</Text>
          <TextInput
            onEndEditing={this.handleBoughtPriceInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={7}
            onChange={() => this.setState({ editingPrice: true })}
            onChangeText={this.handleBoughtPriceChange}
            value={editingPrice ? tempBoughtPrice : String(BoughtPrice)}
          />
          {this.renderCurrencyPicker()}
        </View>

        <View style={styles.inputInline}>
          <Text style={styles.bold}>Exchange:</Text>
          {this.renderExchangePicker()}
        </View>
      </Prompt>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    marginTop: 20,
    marginBottom: 20,
  },
  bold: {
    fontWeight: '900',
  },
  alertRadioForm: {
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  inputInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  alertTextInput: {
    width: 80,
    marginRight: 10,
    marginLeft: 10,
    // flexGrow: 1,
  },
  percentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
