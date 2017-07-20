import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Alert } from 'react-native';

import { toUpper, round, find } from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import currencySymbol from 'currency-symbol-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'react-native-check-box';

import Button from '../Button';
import SplitPrompt from './SplitPrompt';
import SellPrompt from './SellPrompt';

import { GREEN, RED, ALMOST_WHITE } from '../../styles';

import { formatAmount } from '../../utils/general';
import { exchanges, freeLimits } from '../../config';
import I18n from '../../translations';

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
    portfolioEntries: PropTypes.number,
    mergingEntry: PropTypes.bool,
    mergingStacks: PropTypes.bool,
    onStack: PropTypes.func,
    mergingCrypto: PropTypes.string,
  };

  static defaultProps = {
    currentPrice: 1,
    mergingEntry: false,
    mergingStacks: false,
  }

  state = {
    splitPromptOpen: false,
    sellPromptOpen: false,
  }

  handleDelete = () => {
    const { id, deleteEntry } = this.props;
    Alert.alert(
      I18n.t('portfolioCard.deleteStack'),
      I18n.t('portfolioCard.deleteDescription'),
      [
        { text: I18n.t('cancel'), style: 'cancel' },
        {
          text: I18n.t('delete'),
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

  handleClickStack = () => {
    const { id, crypto } = this.props;
    this.props.onStack(id, crypto);
  }

  render() {
    const { splitPromptOpen, sellPromptOpen } = this.state;
    const { amount, boughtPrice, currency, crypto, timestamp, currentPrice, exchangeId, mergingEntry, mergingStacks, mergingCrypto } = this.props;
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
            <Text><Text style={styles.bold}>{I18n.t('portfolioCard.worth')}</Text> {`${symbol}${formatAmount(currentValue)}`}</Text>
            <Text><Text style={styles.bold}>{I18n.t('portfolioCard.boughtPrice')}</Text> {symbol}{boughtPrice} /{toUpper(crypto)}</Text>
            <Text><Text style={styles.bold}>{I18n.t('portfolioCard.boughtValue')}</Text> {symbol}{formatAmount(boughtPrice * amount)}</Text>
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
            {mergingStacks
              ? (mergingCrypto === crypto &&
                <CheckBox
                  style={styles.icon}
                  onClick={this.handleClickStack}
                  isChecked={mergingEntry}
                />
              )
              : <Button touchableOpacity onPressFunc={this.handleClickStack}>
                <Icon style={styles.icon} name="call-merge" size={25} />
              </Button>
            }
            {this.props.portfolioEntries < freeLimits.portfolio &&
              <Button touchableOpacity onPressFunc={this.handleOpenSplitPrompt}>
                <Icon style={styles.icon} name="call-split" size={25} />
              </Button>
            }
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
