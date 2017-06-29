import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filter, get, round, uniqBy } from 'lodash';
import numeral from 'numeral';

import { convertMoney } from '../utils/prices';
import { create, deleteEntry, split, stack, sell } from '../actions/portfolio';

import PortfolioCard from '../components/portfolio/PortfolioCard';
import AddStackPrompt from '../components/portfolio/AddStackPrompt';

import { GREY, DARKER_BLUE, LIGHT_BLUE, BLUE } from '../styles';


@connect(({
  prices: { markets },
  portfolio: { portfolio },
}) => ({ markets, portfolio: filter(portfolio, { positionOpened: true }) }),
  { create, deleteEntry, split, stack, sell },
)
export default class Portfolio extends Component {
  static navigationOptions = () => ({
    tabBarLabel: 'Open',
    tabBarIcon: ({ tintColor }) => <Icon name="wallet" size={20} color={tintColor} />,
  });

  static propTypes = {
    markets: PropTypes.object,
    portfolio: PropTypes.array,
    create: PropTypes.func,
    deleteEntry: PropTypes.func,
    split: PropTypes.func,
    stack: PropTypes.func,
    sell: PropTypes.func,
  };

  static defaultProps = {
    markets: {},
    portfolio: {},
    create: () => {},
    deleteEntry: () => {},
    split: () => {},
    stack: () => {},
    sell: () => {},
  }

  _renderItem = ({ item: { id, amount, boughtPrice, currency, crypto, timestamp, exchange } }) => (
    <PortfolioCard
      id={id}
      boughtPrice={boughtPrice}
      currentPrice={get(this.props.markets, `[${crypto}${currency}][${exchange}].price.last`, boughtPrice)}
      currency={currency}
      crypto={crypto}
      timestamp={timestamp}
      amount={amount}
      deleteEntry={this.props.deleteEntry}
      splitEntry={this.props.split}
      sellEntry={this.props.sell}
      exchangeId={exchange}
    />
  )

  calcStats = (entriesArray) => {
    const { markets } = this.props;
    // const uniqCurrencies = uniqBy(entriesArray, 'currency')
    //   .reduce((acc, c) => { acc[c.currency] = 0; return acc; }, {});
    const results = {
      rentability: 0,
      totalFiat: {
        eur: 0,
        eurConverted: 0,
        usd: 0,
        gbp: 0,
      },
    };

    entriesArray.forEach((entry) => {
      const { crypto, currency, exchange, amount, boughtPrice } = entry;
      results.totalFiat[currency] += amount * boughtPrice;
      results.totalFiat.eurConverted += convertMoney(amount * boughtPrice, currency, 'EUR');
      const currentPrice = get(markets, `[${crypto}${currency}][${exchange}].price.last`, boughtPrice);
      const changePercent = ((currentPrice - boughtPrice) / boughtPrice);
      results.rentability += changePercent;
    });

    results.rentability = round((results.rentability / entriesArray.length) * 100, 2) || 0;
    return results;
  }

  renderStats() {
    const { rentability, totalFiat } = this.calcStats(this.props.portfolio);
    return (
      <View style={styles.stats} elevation={2}>
        <View style={styles.multiline}>
          <Text style={styles.content}>{`${rentability >= 100.0 ? '+' : ''}${rentability}%`}</Text>
          <Text style={styles.subtitle}>Avg. rentability</Text>
        </View>

        <View style={styles.multiline}>
          <Text style={styles.content}>€{numeral(totalFiat.eurConverted).format('0,0.00')}</Text>
          <Text style={styles.subtitle}>Amount invested (€)</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <AddStackPrompt />
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
