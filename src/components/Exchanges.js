import React, { PropTypes } from 'react';
import { StyleSheet, View, SectionList, Text } from 'react-native';

import { orderBy, get, intersection, find } from 'lodash';

import Exchange from './Exchange';
import { DARK_BLUE } from '../styles';
import { pairs, cryptos } from '../config';

export default function Exchanges({
  markets,
  isFetching,
  refreshPrices,
  toggleExchangeFavorite,
  onExchangePress,
  uid,
  favoritePairs,
  openAlertPrompt,
  onlyFavorites,
}) {
  const pairExchanges = (pair, market) => {
    const obj = Object.keys(market);
    if (!onlyFavorites) return obj;
    return intersection(obj, favoritePairs[pair] || []);
  };

  const sections = pairs.map(({ id, name, crypto }) => ({
    data: markets[id]
      ? pairExchanges(id, markets[id]).map(exchangeid => ({
        exchangeid,
        pair: id,
        ...markets[id][exchangeid],
      }))
      : [],
    title: name,
    crypto: find(cryptos, { id: crypto }),
    key: id,
  })).filter(e => e.data.length);

  const renderItem = ({ item: { exchangeid, pair, price, volume } }) => {
    if (!price && !volume) return;
    const { change: { absolute, percentage }, ...rest } = price;
    return (
      <Exchange
        key={`${exchangeid}${pair}`}
        id={exchangeid}
        pair={pair}
        favorite={get(favoritePairs, pair, []).includes(exchangeid)}
        volume={volume}
        onFavorite={toggleExchangeFavorite}
        onExchangePress={onExchangePress}
        absolute={absolute}
        percentage={percentage}
        openAlertPrompt={openAlertPrompt}
        {...rest}
      />
    );
  };

  const renderSectionHeader = ({ section: { title, crypto: { longName, color } } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: color }]}>
      <Text style={styles.headerText} key={title}>
        <Text style={styles.bold}>{longName}</Text> ∙ {title}
      </Text>
    </View>
  );

  return (
    <SectionList
      onRefresh={refreshPrices}
      refreshing={isFetching}
      renderItem={renderItem}
      keyExtractor={({ exchangeid, pair }) => `${exchangeid}${pair}`}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      stickySectionHeadersEnabled
    />
  );
}

Exchanges.propTypes = {
  markets: PropTypes.object.isRequired,
  exchanges: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  refreshPrices: PropTypes.func,
  toggleExchangeFavorite: PropTypes.func,
  onExchangePress: PropTypes.func,
  crypto: PropTypes.string,
  currency: PropTypes.string,
  favoritePairs: PropTypes.object,
  openAlertPrompt: PropTypes.func,
  onlyFavorites: PropTypes.bool,
};

Exchanges.defaultProps = {
  lastUpdate: null,
  exchanges: {},
  markets: {},
  refreshPrices: () => {},
  toggleExchangeFavorite: () => {},
  onExchangePress: () => {},
  crypto: 'eth',
  currency: 'usd',
};

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: DARK_BLUE,
    padding: 8,
    alignItems: 'center',
  },
  headerText: {
    // fontWeight: 'bold',
    color: 'white',
  },
  container: {
    paddingBottom: 20,
    flexDirection: 'column',
  },
  bold: {
    fontWeight: 'bold',
  },
});
