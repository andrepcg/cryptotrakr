import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TextInput, Picker } from 'react-native';
import { connect } from 'react-redux';
import currencySymbol from 'currency-symbol-map';
import { toUpper, find, round, clamp } from 'lodash';

import { exchanges } from '../../config';
import Prompt from '../Prompt';
import { openAddPrompt, create, closeAddPrompt } from '../../actions/portfolio';

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

  render() {
    const { visible, closeAddPrompt } = this.props;
    const { StackAmount, editing, editingPrice, tempStackAmount, tempBoughtPrice, BoughtPrice, currency, crypto, exchange } = this.state;
    // const upperCrypto = toUpper(crypto);

    return (
      <Prompt
        visible={visible}
        close={closeAddPrompt}
        title="Create portfolio stack"
        options={[{ label: 'Cancel' }, { label: 'Create', onPress: this.handleCreate }]}
      >
        <View style={styles.inputInline}>
          <Text style={styles.bold}>Amount bought:</Text>
          <TextInput
            onEndEditing={this.handleStackAmountInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={10}
            onChange={() => this.setState({ editing: true })}
            onChangeText={this.handleNewAmountChange}
            value={editing ? tempStackAmount : String(StackAmount)}
          />
          <Picker
            style={{ width: 100 }}
            selectedValue={crypto}
            onValueChange={crypto => this.setState({ crypto })}
            mode="dropdown"
          >
            <Picker.Item label="ETH" value="eth" />
            <Picker.Item label="BTC" value="btc" />
          </Picker>
          {/*<Text style={styles.bold}>ETH</Text>*/}
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
          <Picker
            style={{ width: 100 }}
            selectedValue={currency}
            onValueChange={currency => this.setState({ currency })}
            mode="dropdown"
          >
            <Picker.Item label="USD" value="usd" />
            <Picker.Item label="EUR" value="eur" />
          </Picker>
          {/*<Text style={styles.bold}>EUR</Text>*/}
        </View>

        <View style={styles.inputInline}>
          <Text style={styles.bold}>Exchange:</Text>
          <Picker
            style={{ width: 170 }}
            selectedValue={exchange}
            onValueChange={exchange => this.setState({ exchange })}
            mode="dropdown"
          >
            {Object.values(exchanges).map(e =>
              <Picker.Item key={e.id} label={e.name} value={e.id} />,
            )}
          </Picker>
          {/*<Text style={styles.bold}>EUR</Text>*/}
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
