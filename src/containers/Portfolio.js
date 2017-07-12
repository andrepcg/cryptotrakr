import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filter, get, round, uniqBy, without } from 'lodash';
import numeral from 'numeral';

import { convertMoney } from '../utils/prices';
import { create, deleteEntry, split, stack, sell, addStackToMerge } from '../actions/portfolio';

import PortfolioCard from '../components/portfolio/PortfolioCard';
import AddStackPrompt from '../components/portfolio/AddStackPrompt';
import MergeStacks from '../components/MergeStacks';

import { GREY, DARKER_BLUE, LIGHT_BLUE, BLUE } from '../styles';


@connect(({
  prices: { markets },
  portfolio: { portfolio, stacking: { isStacking, stacksToMerge, crypto: stackingCrypto } },
}) => ({ markets, portfolio: filter(portfolio, { positionOpened: true }), isStacking, stacksToMerge, stackingCrypto }),
  { create, deleteEntry, split, stack, sell, addStackToMerge },
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
    addStackToMerge: PropTypes.func,
    isStacking: PropTypes.bool,
    stacksToMerge: PropTypes.array,
    stackingCrypto: PropTypes.string,
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
      portfolioEntries={this.props.portfolio.length}
      onStack={this.props.addStackToMerge}
      mergingStacks={this.props.isStacking}
      mergingEntry={this.props.stacksToMerge.includes(id)}
      mergingCrypto={this.props.stackingCrypto}
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

  handleStack = () => {
    const { stacksToMerge, stack } = this.props;
    stack(stacksToMerge);
  }

  render() {
    const { isStacking, stacksToMerge } = this.props;
    return (
      <View style={styles.container}>
        <AddStackPrompt />
        {this.renderStats()}
        <FlatList
          data={this.props.portfolio}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}
        />
        {isStacking && <MergeStacks stacksCount={stacksToMerge.length} stack={this.handleStack} />}
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
