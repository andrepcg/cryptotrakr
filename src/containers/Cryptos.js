import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { fetchPrices, setFavoritePair } from '../actions/prices';
import { openExchange } from '../actions/exchange';
import { openAlertPrompt } from '../actions/alerts';

import Exchanges from '../components/Exchanges';
import LastUpdate from '../components/LastUpdate';
import AlertPrompt from '../components/AlertPrompt';

import { Banner, buildRequest } from '../firebase';

import { SUPER_DARKER_BLUE } from '../styles';


@connect((
  {
    purchases: { noads, premium },
    network: { isConnected },
    prices: { isFetching, lastReceiveTime, markets, favoritePairs },
    user: { uid },
  }) => ({ isFetching, lastReceiveTime, markets, isConnected, uid, favoritePairs, isPremium: premium, noAds: noads }),
  { fetchPrices, setFavoritePair, openExchange, openAlertPrompt },
)
export default class Cryptos extends Component {
  static propTypes = {
    fetchPrices: PropTypes.func,
    isFetching: PropTypes.bool,
    lastReceiveTime: PropTypes.number,
    markets: PropTypes.object,
    favoritePairs: PropTypes.object,
    setFavoritePair: PropTypes.func,
    openExchange: PropTypes.func,
    isConnected: PropTypes.bool,
    changeCurrency: PropTypes.func,
    createAlert: PropTypes.func,
    openAlertPrompt: PropTypes.func,
    closeAlertPrompt: PropTypes.func,
    uid: PropTypes.string,
    onlyFavorites: PropTypes.bool,
    isPremium: PropTypes.bool,
    noAds: PropTypes.bool,
  };

  static defaultProps = {
    lastReceiveTime: null,
    isFetching: false,
    fetchPrices: () => {},
    setFavoritePair: () => {},
    markets: {},
    favoritePairs: {},
    isConnected: false,
    openExchange: () => {},
    changeCurrency: () => {},
    createAlert: () => {},
    fetchPricesEnabled: false,
    onlyFavorites: false,
  }

  render() {
    const {
      isFetching,
      lastReceiveTime,
      markets,
      isConnected,
      isPremium,
      noAds,
    } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={SUPER_DARKER_BLUE}
          barStyle="light-content"
        />
        <LastUpdate
          lastUpdate={lastReceiveTime}
          isFetching={isFetching}
          isConnected={isConnected}
        />
        <Exchanges
          markets={markets}
          isFetching={isFetching}
          lastUpdate={lastReceiveTime}
          refreshPrices={this.props.fetchPrices}
          toggleExchangeFavorite={this.props.setFavoritePair}
          onExchangePress={this.props.openExchange}
          uid={this.props.uid}
          favoritePairs={this.props.favoritePairs}
          openAlertPrompt={this.props.openAlertPrompt}
          closeAlertPrompt={this.props.closeAlertPrompt}
          onlyFavorites={this.props.onlyFavorites}
        />
        <AlertPrompt />
        {!isPremium && !noAds &&
          <Banner
            unitId="ca-app-pub-3886797449668157/4225712378"
            request={buildRequest().build()}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
});
