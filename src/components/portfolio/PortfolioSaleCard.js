import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Alert } from 'react-native';

import { toUpper, round, find } from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import currencySymbol from 'currency-symbol-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../Button';

import { GREEN, RED, ALMOST_WHITE } from '../../styles';

import { formatAmount } from '../../utils/general';
import { exchanges } from '../../config';

export default class PortfolioSaleCard extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    boughtPrice: PropTypes.number,
    sellPrice: PropTypes.number,
    currency: PropTypes.string,
    crypto: PropTypes.string,
    sellTimestamp: PropTypes.number,
    amount: PropTypes.number,
    deleteSale: PropTypes.func,
    exchangeId: PropTypes.string,
  };

  static defaultProps = {
  }

  handleDelete = () => {
    const { id, deleteSale } = this.props;
    Alert.alert(
      'Delete stack',
      'Do you want to delete this sale?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          // onPress: () => deleteSale(id),
          onPress: () => deleteSale(id, true),
        },
        // {
        //   text: 'Delete Sale & Stack',
        //   onPress: () => deleteSale(id, true),
        // },
      ],
    );
  }

  render() {
    const { amount, boughtPrice, currency, crypto, sellTimestamp, sellPrice, exchangeId } = this.props;
    const sellValue = amount * sellPrice;
    const appreciationAbsolute = sellPrice - boughtPrice;
    const changePercent = ((sellPrice - boughtPrice) / boughtPrice) * 100;
    const symbol = currencySymbol(currency);
    const exchange = find(exchanges, { id: exchangeId });

    return (
      <View style={styles.card} elevation={3}>
        <View style={styles.inline}>
          <View>
            <Text style={styles.title}>
              {`${amount} ${toUpper(crypto)} ${currencySymbol(crypto)}`}
            </Text>
            <Text><Text style={styles.bold}>Sale value:</Text> {`${symbol}${formatAmount(sellValue)}`}</Text>
            <Text><Text style={styles.bold}>Sale price:</Text> {symbol}{sellPrice} /{toUpper(crypto)}</Text>
            <Text><Text style={styles.bold}>Bought price:</Text> {symbol}{boughtPrice} /{toUpper(crypto)}</Text>
            <Text><Text style={styles.bold}>Bought value:</Text> {symbol}{formatAmount(boughtPrice * amount)}</Text>
            {exchange && <Text><Text style={styles.bold}>Exchange:</Text> {exchange.name}</Text>}
          </View>
          <View>
            <View style={[styles.appreciation, appreciationAbsolute < 0 ? styles.red : styles.green]}>
              <Text style={[styles.appreciationFont, styles.bold]}>
                {`${changePercent > 0 ? '+' : ''}${round(changePercent, 3)}%`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionBar}>
          <Text>{moment(sellTimestamp).format('YYYY/MM/DD HH:mm')}</Text>
          <View style={styles.buttons}>
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
