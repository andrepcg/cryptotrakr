import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filter } from 'lodash';


import { deleteSale } from '../actions/portfolio';

import PortfolioSaleCard from '../components/portfolio/PortfolioSaleCard';

@connect((
  {
    prices: { markets },
    portfolio: { portfolio, sales },
  }) => ({ markets, portfolio, sales }),
  { deleteSale },
)
export default class PortfolioSold extends Component {
  static navigationOptions = () => ({
    tabBarLabel: 'Closed',
    tabBarIcon: ({ tintColor }) => <Icon name="wallet" size={20} color={tintColor} />,
  });

  static propTypes = {
    markets: PropTypes.object,
    portfolio: PropTypes.object,
    sales: PropTypes.object,
    deleteSale: PropTypes.func,
  };

  static defaultProps = {
    markets: {},
    portfolio: {},
    sales: {},
    deleteSale: () => {},
  }

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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={filter(this.props.portfolio, { positionOpened: false })}
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
