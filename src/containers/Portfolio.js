import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filter, get } from 'lodash';

import { create, deleteEntry, split, stack, sell } from '../actions/portfolio';

import PortfolioCard from '../components/portfolio/PortfolioCard';
import AddStackPrompt from '../components/portfolio/AddStackPrompt';

@connect((
  {
    prices: { markets },
    portfolio: { portfolio },
  }) => ({ markets, portfolio }),
  { create, deleteEntry, split, stack, sell },
)
export default class Portfolio extends Component {
  static navigationOptions = () => ({
    tabBarLabel: 'Open',
    tabBarIcon: ({ tintColor }) => <Icon name="wallet" size={20} color={tintColor} />,
  });

  static propTypes = {
    markets: PropTypes.object,
    portfolio: PropTypes.object,
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
      currentPrice={get(this.props.markets, `[${crypto}${currency}][${exchange}].price.last`, 0)}
      currency={currency}
      crypto={crypto}
      timestamp={timestamp}
      amount={amount}
      deleteEntry={this.props.deleteEntry}
      splitEntry={this.props.split}
      sellEntry={this.props.sell}
      exchangeId={exchange}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <AddStackPrompt />
        <FlatList
          data={filter(this.props.portfolio, { positionOpened: true })}
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
});
