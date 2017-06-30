import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, Slider, Button } from 'react-native';
import currencySymbol from 'currency-symbol-map';
import { toUpper, round, throttle } from 'lodash';

import { DARK_BLUE } from '../../styles';
// import { exchanges } from '../config';
import Prompt from './../Prompt';

const MINMAX_PERCENT = 0.01;
const maxValue = value => round(value * (1 - MINMAX_PERCENT), 5);
const minValue = value => round(value * MINMAX_PERCENT, 5);

const percentButtons = [0.25, 0.5, 0.75];

export default class SplitPrompt extends PureComponent {
  static propTypes = {
    currency: PropTypes.string,
    crypto: PropTypes.string,
    visible: PropTypes.bool,
    closePrompt: PropTypes.func,
    stackAmount: PropTypes.number,
    splitEntry: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    lastPrice: 0,
  };

  state = this.clearState();

  clearState() {
    return {
      newStackAmount: minValue(this.props.stackAmount),
      sliding: false,
    };
  }

  handleNewAmountChange = (newStackAmount) => {
    this.setState({ newStackAmount: round(newStackAmount, 5), sliding: false });
  }

  handleSplit = () => {
    const { newStackAmount } = this.state;
    this.props.splitEntry(newStackAmount);
  }

  handlePercentChange = (percent) => {
    const { stackAmount } = this.props;
    const value = round(stackAmount * percent, 5);
    this.setState({ newStackAmount: value });
  }

  liveSliderUpdater = throttle((value) => {
    this.setState({ newStackAmount: round(value, 5), sliding: true });
  }, 100, { leading: true });

  render() {
    const { currency, crypto, visible, closePrompt, stackAmount } = this.props;
    const { newStackAmount, sliding } = this.state;
    const upperCrypto = toUpper(crypto);
    const sliderProps = {};
    if (!sliding) sliderProps.value = newStackAmount;

    return (
      <Prompt
        visible={visible}
        close={closePrompt}
        title={`Splitting ${stackAmount} ${upperCrypto} stack`}
        options={[{ label: 'Cancel' }, { label: 'Split', onPress: this.handleSplit }]}
      >
        <Text>Create a new stack with <Text style={styles.bold}>{newStackAmount} {upperCrypto}</Text></Text>
        <Slider
          onValueChange={this.liveSliderUpdater}
          onSlidingComplete={this.handleNewAmountChange}
          // value={newStackAmount}
          step={stackAmount / 100}
          minimumValue={minValue(stackAmount)}
          maximumValue={maxValue(stackAmount)}
          style={styles.slider}
          {...sliderProps}
        />

        <View style={styles.percentButtons}>
          {percentButtons.map(v => <Button key={v} color={DARK_BLUE} onPress={() => this.handlePercentChange(v)} title={`${v * 100}%`} />)}
        </View>

        <Text><Text style={styles.bold}>Original stack:</Text> {round(stackAmount - newStackAmount, 5)} {upperCrypto}</Text>
        <Text><Text style={styles.bold}>New stack:</Text> {newStackAmount} {upperCrypto}</Text>
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
  percentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
