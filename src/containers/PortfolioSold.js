import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filter, round } from 'lodash';
import numeral from 'numeral';
import currencySymbol from 'currency-symbol-map';


import { BLUE } from '../styles';
import { deleteSale } from '../actions/portfolio';
import { convertMoney } from '../utils/prices';
import I18n from '../translations';

import PortfolioSaleCard from '../components/portfolio/PortfolioSaleCard';

@connect((
  {
    prices: { markets },
    portfolio: { portfolio },
    settings: { defaultCurrency },
  }) => ({ defaultCurrency, markets, portfolio: filter(portfolio, { positionOpened: false }) }),
  { deleteSale },
)
export default class PortfolioSold extends Component {
  static navigationOptions = () => ({
    tabBarLabel: I18n.t('closed'),
    tabBarIcon: ({ tintColor }) => <Icon name="wallet" size={20} color={tintColor} />,
  });

  static propTypes = {
    markets: PropTypes.object,
    portfolio: PropTypes.array,
    deleteSale: PropTypes.func,
    defaultCurrency: PropTypes.string,
  };

  static defaultProps = {
    markets: {},
    portfolio: {},
    sales: {},
    deleteSale: () => {},
  };

  _renderItem = (
    { item: { id, amount, boughtPrice, currency, crypto, sellTimestamp, exchange, sellPrice } },
  ) => (
    <PortfolioSaleCard
      id={id}
      boughtPrice={boughtPrice}
      currency={currency}
      crypto={crypto}
      sellTimestamp={sellTimestamp}
      amount={amount}
      deleteSale={this.props.deleteSale}
      exchangeId={exchange}
      sellPrice={sellPrice}
    />
  );

  calcStats = (entriesArray) => {
    const { defaultCurrency } = this.props;
    const results = {
      rentability: 0,
      totalFiat: {
        eur: 0,
        converted: 0,
        usd: 0,
        gbp: 0,
      },
      profit: {
        eur: 0,
        converted: 0,
        usd: 0,
        gbp: 0,
      },
    };

    entriesArray.forEach((entry) => {
      const { currency, amount, boughtPrice, sellPrice } = entry;
      results.totalFiat[currency] += amount * boughtPrice;
      results.totalFiat.converted += convertMoney(amount * boughtPrice, currency, defaultCurrency);
      const changePercent = ((sellPrice - boughtPrice) / boughtPrice);
      results.rentability += changePercent;

      results.profit[currency] += amount * (sellPrice - boughtPrice);
      results.profit.converted += convertMoney(amount * (sellPrice - boughtPrice), currency, defaultCurrency);
    });

    results.rentability = round((results.rentability / entriesArray.length) * 100, 2) || 0;
    return results;
  }

  renderStats() {
    const { defaultCurrency } = this.props;
    const { rentability, totalFiat, profit } = this.calcStats(this.props.portfolio);
    const symbol = currencySymbol(defaultCurrency);
    return (
      <View style={styles.stats} elevation={2}>
        <View style={styles.multiline}>
          <Text style={styles.content}>{`${rentability >= 100.0 ? '+' : ''}${rentability}%`}</Text>
          <Text style={styles.subtitle}>{I18n.t('avgRentability')}</Text>
        </View>

        <View style={styles.multiline}>
          <Text style={styles.content}>{symbol}{numeral(totalFiat.converted).format('0,0.00')}</Text>
          <Text style={styles.subtitle}>{I18n.t('amtInvested', { symbol })}</Text>
        </View>

        <View style={styles.multiline}>
          <Text style={styles.content}>{symbol}{numeral(profit.converted).format('0,0.00')}</Text>
          <Text style={styles.subtitle}>{I18n.t('profit', { symbol })}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderStats()}
        <FlatList
          data={this.props.portfolio}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    // padding: 10,
  },
  stats: {
    // backgroundColor: GREY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: BLUE,
  },
  content: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  multiline: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: 'white',
  },
});
