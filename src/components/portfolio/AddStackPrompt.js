import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import currencySymbol from 'currency-symbol-map';
import { toUpper, find, round, clamp } from 'lodash';

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
      const newBoughtPrice = Number(String(tempBoughtPrice).replace(',', '.'));
      this.setState({ BoughtPrice: clamp(newBoughtPrice, 0.0001, 9999999), editingPrice: false });
    }
  }

  handleBoughtPriceChange = (tempBoughtPrice) => {
    this.setState({ tempBoughtPrice });
  }

  handleCreate = () => {
    const { StackAmount, BoughtPrice } = this.state;
    // this.props.create(StackAmount, BoughtPrice, currency, crypto);
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
        <Text><Text style={styles.bold}>Available:</Text> 123</Text>
        <View style={styles.inputInline}>
          <Text style={styles.bold}>Amount bought:</Text>
          <TextInput
            placeholder={String(StackAmount)}
            onEndEditing={this.handleStackAmountInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={8}
            onChange={() => this.setState({ editing: true })}
            onChangeText={this.handleNewAmountChange}
            value={editing ? tempStackAmount : String(StackAmount)}
          />
          <Text style={styles.bold}>ETH</Text>
        </View>

        <View style={styles.inputInline}>
          <Text style={styles.bold}>Market price:</Text>
          <TextInput
            onEndEditing={this.handleBoughtPriceInputEnd}
            style={styles.alertTextInput}
            keyboardType="numeric"
            maxLength={8}
            onChange={() => this.setState({ editingPrice: true })}
            onChangeText={this.handleBoughtPriceChange}
            value={editingPrice ? tempBoughtPrice : String(BoughtPrice)}
          />
          <Text style={styles.bold}>EUR</Text>
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
