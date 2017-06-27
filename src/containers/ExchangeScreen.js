import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { round, upperCase, toPairs, debounce } from 'lodash';
import numeral from 'numeral';
import currencySymbol from 'currency-symbol-map';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tinycolor from 'tinycolor2';

import { strings } from '../utils/timeframes';
import { candleMean } from '../utils/prices';
import { fetchOhlc, fetchPrices } from '../actions/prices';
import { changePeriod } from '../actions/exchange';
import { openAlertPrompt } from '../actions/alerts';

import { ALMOST_WHITE, DARKER_BLUE, GREEN, darkHeader } from '../styles';

import PriceVolumeChart from '../components/PriceVolumeChart';
import AlertPrompt from '../components/AlertPrompt';
import Button from '../components/Button';

function formatNumber(number) {
  const n = Math.abs(number) < 1e-6 ? 0.00000 : number;
  if (Math.abs(number) < 1) return numeral(n).format('0,0.00000');
  return numeral(n).format('0,0.000');
}

const selectedPeriodColor = tinycolor(GREEN).darken(20).toString();

@connect(
  ({
    user: { uid },
    exchange: {
      isFetching: isFetchingOhlc,
      lastReceiveTime: lastOhlcReceiveTime,
      ohlc,
      currentPeriod,
      currentExchange,
      timeframe,
      currentCrypto,
      currentCurrency,
    },
  }) =>
  ({
    isFetchingOhlc,
    lastOhlcReceiveTime,
    ohlc: ohlc[currentPeriod],
    currentPeriod,
    currentExchange,
    timeframe,
    currentCrypto,
    currentCurrency,
    uid,
  }),
  { fetchOhlc, fetchPrices, changePeriod },
)
export default class ExchangeScreen extends Component {
  static propTypes = {
    isFetchingOhlc: PropTypes.bool,
    lastOhlcReceiveTime: PropTypes.number,
    ohlc: PropTypes.array,
    currentPeriod: PropTypes.number,
    currentExchange: PropTypes.string,
    timeframe: PropTypes.string,
    fetchOhlc: PropTypes.func,
    currentCurrency: PropTypes.string,
    currentCrypto: PropTypes.string,
    changePeriod: PropTypes.func,
    uid: PropTypes.string,
  };

  static defaultProps = {
  };

  static navigationOptions = (
    { navigation: { dispatch, state: { params: { exchangeName, crypto, currency } } } },
  ) => ({
    title: `${exchangeName} (${upperCase(crypto)}/${upperCase(currency)})`,
    ...darkHeader,
    headerRight: <Button touchableOpacity onPressFunc={() => dispatch(openAlertPrompt())}>
      <Icon name="bell" size={30} color="#fff" />
    </Button>,
  });

  componentDidMount() {
    this.refeshPrices();
  }

  componentDidUpdate(prevProps) {
    const { currentPeriod, timeframe } = this.props;
    if (currentPeriod !== prevProps.currentPeriod || timeframe !== prevProps.timeframe) {
      this.refeshPrices();
    }
  }

  getLastPrice() {
    const { ohlc } = this.props;

    let lastOhlc = 0;
    let lastPriceAvg = 0;

    if (ohlc) {
      lastOhlc = ohlc[ohlc.length - 1];
      lastPriceAvg = candleMean(lastOhlc);
    }

    return lastPriceAvg;
  }

  handlePeriodChange = debounce((period) => {
    const { changePeriod, timeframe } = this.props;
    if (period !== timeframe) changePeriod(period);
  }, 500, { leading: true, trailing: false });

  refeshPrices() {
    const { fetchOhlc, currentExchange, currentPeriod, timeframe, currentCurrency, currentCrypto } = this.props;
    fetchOhlc(currentExchange, currentCurrency, currentCrypto, currentPeriod, timeframe);
  }

  renderLoading() {
    const { isFetchingOhlc } = this.props;
    return (isFetchingOhlc &&
      <View style={styles.activityIndicator}>
        <ActivityIndicator
          animating
          style={{ height: 80 }}
          size="large"
        />
      </View>
    );
  }

  renderPeriodSelector() {
    const { timeframe } = this.props;
    return (
      <View style={styles.periodSelector}>
        {toPairs(strings).map(([id, string]) => (
          <TouchableOpacity
            style={[
              styles.periodText,
              { backgroundColor: timeframe === id ? selectedPeriodColor : GREEN },
            ]}
            onPress={() => this.handlePeriodChange(id)}
            key={id}
          >
            <Text>{string}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderPrice() {
    const { ohlc, timeframe, currentCurrency } = this.props;

    let firstOhlc = 0;
    let lastOhlc = 0;
    let lastPriceAvg = 0;
    let firstPriceAvg = 0;
    let changePercent = 0;
    let changeAbsolute = 0;

    if (ohlc) {
      lastOhlc = ohlc[ohlc.length - 1];
      firstOhlc = ohlc[0];
      lastPriceAvg = candleMean(lastOhlc);
      firstPriceAvg = candleMean(firstOhlc);
      changePercent = ((lastPriceAvg - firstPriceAvg) / firstPriceAvg) * 100;
      changeAbsolute = lastPriceAvg - firstPriceAvg;
    }

    return (
      <View style={styles.price}>
        <View style={styles.multiline}>
          <Text style={styles.priceText}>{`${currencySymbol(currentCurrency)}${formatNumber(lastPriceAvg)}`}</Text>
          <Text style={styles.subtitle}>Price</Text>
        </View>

        <View style={styles.multiline}>
          <Text style={styles.priceText}>{`${changePercent > 0 ? '+' : ''}${round(changePercent, 2)}%`}</Text>
          <Text style={styles.subtitle}>Since {strings[timeframe]} ago (%)</Text>
        </View>

        <View style={styles.multiline}>
          <Text style={styles.priceText}>{`${changeAbsolute > 0 ? '+' : ''}${currencySymbol(currentCurrency)}${formatNumber(changeAbsolute)}`}</Text>
          <Text style={styles.subtitle}>Since {strings[timeframe]} ago ({upperCase(currentCurrency)})</Text>
        </View>
      </View>
    );
  }

  render() {
    const { ohlc, timeframe, currentCurrency } = this.props;

    return (
      <View style={styles.container}>
        <AlertPrompt lastPrice={this.getLastPrice()} />
        {this.renderPrice()}
        {this.renderPeriodSelector()}

        <PriceVolumeChart
          ohlcPeriod={ohlc}
          currencySymbol={currencySymbol(currentCurrency)}
          timeframe={timeframe}
        />

        {this.renderLoading()}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ALMOST_WHITE,
  },
  loadingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 30,
    marginBottom: 200,
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: DARKER_BLUE,
  },
  periodSelector: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 10,
  },
  periodText: {
    backgroundColor: GREEN,
    padding: 10,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
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
