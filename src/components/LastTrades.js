import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { takeRight } from 'lodash';
import numeral from 'numeral';
import tinycolor from 'tinycolor2';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { convertMoney } from '../utils/prices';
import I18n from '../translations';


import { DARKER_BLUE, ALMOST_WHITE } from '../styles';

const RED = '#bc0101';
const GREEN = '#03b203';
const ODD = tinycolor(DARKER_BLUE).lighten(5).toString();
const EVEN = DARKER_BLUE;

/*
  trade = [id, timestamp, price, amount]
*/
function formatNumber(number) {
  const n = Math.abs(number) < 1e-6 ? 0.00000 : number;
  if (Math.abs(number) < 1) return numeral(n).format('0,0.00000');
  return numeral(n).format('0,0.000');
}

export default class LastTrades extends Component {
  static propTypes = {
    trades: PropTypes.array,
    lastReceiveTime: PropTypes.number,
    currencySymbol: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    const { lastReceiveTime, isFetching } = this.props;
    if (isFetching !== nextProps.isFetching || lastReceiveTime !== nextProps.lastReceiveTime) {
      return true;
    }
    return false;
  }

  lastColor = '#cecece';

  renderTrade(timestamp, price, amount, index, previousTrade = []) {
    const { currencySymbol } = this.props;
    const previousPrice = formatNumber(previousTrade[2] || 0);
    const formatedPrice = formatNumber(price);
    let color = '#cecece';

    if (formatedPrice > previousPrice) {
      color = GREEN;
    } else if (formatedPrice < previousPrice) {
      color = RED;
    } else if (formatedPrice === previousPrice) {
      color = this.lastColor;
    }
    this.lastColor = color;

    return (
      <View key={`${timestamp}-${index}`} style={[styles.trade, { backgroundColor: index % 2 === 0 ? EVEN : ODD }]}>
        <Text style={{ color }}>{`${currencySymbol}${formatNumber(price)}`}</Text>
        <Text style={{ color }}>{formatNumber(amount)}</Text>
        <Text style={{ color }}>{moment(timestamp * 1000).format('HH:mm:ss')}</Text>
      </View>
    );
  }

  render() {
    const { trades, isFetching } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('trades')}</Text>
        <View style={styles.list}>
          {isFetching &&
            <ActivityIndicator
              size="large"
              color="white"
            />
          }
          {!isFetching &&
            takeRight(trades, 12).map(([id, timestamp, price, amount], index, arr) =>
              this.renderTrade(timestamp, price, amount, index, arr[index - 1]),
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 5,
    // paddingRight: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: 300,
    backgroundColor: DARKER_BLUE,
  },
  title: {
    fontSize: 26,
    color: ALMOST_WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    minHeight: 100,
    flexDirection: 'column-reverse',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  trade: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inline: {
    flexDirection: 'row',
  },
});
