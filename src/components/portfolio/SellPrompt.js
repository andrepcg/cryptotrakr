import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import currencySymbol from 'currency-symbol-map';
import { toUpper, round, clamp } from 'lodash';

import Prompt from '../Prompt';

const MINMAX_PERCENT = 0.01;
const minValue = value => round(value * MINMAX_PERCENT, 5);

const percentButtons = [0.25, 0.5, 0.75];

export default class SellPrompt extends PureComponent {
  static propTypes = {
    currency: PropTypes.string,
    crypto: PropTypes.string,
    visible: PropTypes.bool,
    closePrompt: PropTypes.func,
    stackAmount: PropTypes.number,
    sellEntry: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };

  state = this.clearState();

  clearState() {
    return {
      sellAmount: minValue(this.props.stackAmount),
      sellPrice: 0,
      editing: false,
      editingPrice: false,
      tempSellAmount: minValue(this.props.stackAmount),
      tempSellPrice: '',
    };
  }

  handleNewAmountChange = (sellAmount) => {
    this.setState({ tempSellAmount: sellAmount });
  }

  handleSellAmountInputEnd = () => {
    const { tempSellAmount, editing } = this.state;
    const { stackAmount } = this.props;
    const minV = minValue(stackAmount);
    if (editing) {
      const newSellAmount = Number(String(tempSellAmount).replace(',', '.')) || minV;
      this.setState({ sellAmount: clamp(newSellAmount, 0.0001, stackAmount), editing: false });
    }
  }

  handleSellPriceInputEnd = () => {
    const { tempSellPrice, editingPrice } = this.state;
    if (editingPrice) {
      const newSellPrice = Number(String(tempSellPrice).replace(',', '.'));
      this.setState({ sellPrice: clamp(newSellPrice, 0.0001, 9999999), editingPrice: false });
    }
  }

  handleSellPriceChange = (tempSellPrice) => {
    this.setState({ tempSellPrice });
  }

  handleSell = () => {
    const { sellAmount, sellPrice } = this.state;
    this.props.sellEntry(sellAmount, sellPrice);
  }

  render() {
    const { currency, crypto, visible, closePrompt, stackAmount } = this.props;
    const { sellAmount, editing, editingPrice, tempSellAmount, tempSellPrice, sellPrice } = this.state;
    const upperCrypto = toUpper(crypto);

    return (
      <Prompt
        visible={visible}
        close={closePrompt}
        title="Sell portfolio stack"
        options={[{ label: 'Cancel' }, { label: 'Sell', onPress: this.handleSell }]}
      >
        <Text><Text style={styles.bold}>Available:</Text> {stackAmount} {upperCrypto}</Text>
        <View style={styles.inputInline}>
          <Text style={styles.bold}>Amount to sell:</Text>
          <TextInput
            placeholder={String(sellAmount)}
            onEndEditing={this.handleSellAmountInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={8}
            onChange={() => this.setState({ editing: true })}
            onChangeText={this.handleNewAmountChange}
            value={editing ? tempSellAmount : String(sellAmount)}
          />
          <Text style={styles.bold}>{upperCrypto}</Text>
        </View>

        <View style={styles.inputInline}>
          <Text style={styles.bold}>Sell price:</Text>
          <TextInput
            onEndEditing={this.handleSellPriceInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={8}
            onChange={() => this.setState({ editingPrice: true })}
            onChangeText={this.handleSellPriceChange}
            value={editingPrice ? tempSellPrice : String(sellPrice)}
          />
          <Text style={styles.bold}>{toUpper(currency)}</Text>
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
    width: 100,
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
