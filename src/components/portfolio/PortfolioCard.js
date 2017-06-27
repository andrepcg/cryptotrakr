import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Alert } from 'react-native';

import { toUpper, round, find } from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import currencySymbol from 'currency-symbol-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../Button';
import SplitPrompt from './SplitPrompt';
import SellPrompt from './SellPrompt';

import { GREEN, RED, ALMOST_WHITE } from '../../styles';

import { formatAmount } from '../../utils/general';
import { exchanges } from '../../config';

export default class PortfolioCard extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    boughtPrice: PropTypes.number,
    currentPrice: PropTypes.number,
    currency: PropTypes.string,
    crypto: PropTypes.string,
    timestamp: PropTypes.number,
    amount: PropTypes.number,
    deleteEntry: PropTypes.func,
    sellEntry: PropTypes.func,
    splitEntry: PropTypes.func,
    exchangeId: PropTypes.string,
  };

  static defaultProps = {
    currentPrice: 1,
  }

  state = {
    splitPromptOpen: false,
    sellPromptOpen: false,
  }

  handleDelete = () => {
    const { id, deleteEntry } = this.props;
    Alert.alert(
      'Delete stack',
      'Do you want to delete this portfolio entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteEntry(id),
        },
      ],
    );
  }

  handleOpenSplitPrompt = () => {
    this.setState({ splitPromptOpen: true });
  }

  handleCloseSplitPrompt = () => {
    this.setState({ splitPromptOpen: false });
  }

  handleCloseSellPrompt = () => {
    this.setState({ sellPromptOpen: false });
  }

  handleCreateSplit = (newAmount) => {
    this.props.splitEntry(this.props.id, newAmount);
    this.handleCloseSplitPrompt();
  }

  handleOpenSellPrompt = () => {
    this.setState({ sellPromptOpen: true });
  }

  handleSell = (amount, price) => {
    this.props.sellEntry(this.props.id, amount, price);
    this.handleCloseSellPrompt();
  }

  render() {
    const { splitPromptOpen, sellPromptOpen } = this.state;
    const { amount, boughtPrice, currency, crypto, timestamp, currentPrice, exchangeId } = this.props;
    const currentValue = amount * currentPrice;
    const appreciationAbsolute = currentPrice - boughtPrice;
    const changePercent = (appreciationAbsolute / boughtPrice) * 100;
    const symbol = currencySymbol(currency);
    const exchange = find(exchanges, { id: exchangeId });

    return (
      <View style={styles.card} elevation={3}>
        <SplitPrompt
          closePrompt={this.handleCloseSplitPrompt}
          stackAmount={amount}
          visible={splitPromptOpen}
          crypto={crypto}
          currency={currency}
          splitEntry={this.handleCreateSplit}
        />
        <SellPrompt
          closePrompt={this.handleCloseSellPrompt}
          stackAmount={amount}
          visible={sellPromptOpen}
          crypto={crypto}
          currency={currency}
          sellEntry={(a, p) => this.handleSell(a, p)}
        />
        <View style={styles.inline}>
          <View>
            <Text style={styles.title}>
              {`${amount} ${toUpper(crypto)} ${currencySymbol(crypto)}`}
            </Text>
            <Text><Text style={styles.bold}>Worth:</Text> {`${symbol}${formatAmount(currentValue)}`}</Text>
            <Text><Text style={styles.bold}>Bought price:</Text> {symbol}{boughtPrice} /{toUpper(crypto)}</Text>
            <Text><Text style={styles.bold}>Bought value:</Text> {symbol}{formatAmount(boughtPrice * amount)}</Text>
            {exchange && <Text><Text style={styles.bold}>Exchange:</Text> {exchange.name}</Text>}
          </View>
          <View>
            <View style={[styles.appreciation, appreciationAbsolute < 0 ? styles.red : styles.green]}>
              <Text style={[styles.appreciationFont, styles.bold]}>
                {`${appreciationAbsolute > 0 ? '+' : ''}${round(changePercent, 3)}%`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionBar}>
          <Text>{moment(timestamp).format('YYYY/MM/DD HH:mm')}</Text>
          <View style={styles.buttons}>
            <Button touchableOpacity onPressFunc={this.handleOpenSellPrompt}>
              <Icon style={styles.icon} name="currency-usd" size={25} />
            </Button>
            <Button touchableOpacity onPressFunc={this.handleOpenSplitPrompt}>
              <Icon style={styles.icon} name="call-split" size={25} />
            </Button>
            <Button touchableOpacity onPressFunc={this.handleDelete}>
              <Icon style={styles.icon} name="delete" size={25} />
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 5,
    padding: 10,
    flexDirection: 'column',
    borderRadius: 2,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    marginLeft: 10,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appreciation: {
    // justifyContent: 'flex-end',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    minWidth: 60,
  },
  appreciationFont: {
    color: ALMOST_WHITE,
    // fontWeight: '900',
  },
  bold: {
    fontWeight: 'bold',
  },
  red: {
    backgroundColor: RED,
  },
  green: {
    backgroundColor: GREEN,
  },
});
