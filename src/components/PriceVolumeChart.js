import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { VictoryAxis, VictoryCandlestick, VictoryBar } from 'victory-chart-native';
import moment from 'moment';
import { maxBy, minBy } from 'lodash';
import Svg, { G } from 'react-native-svg';

import { timeframeFormat } from '../utils/timeframes';

import { DARK_BLUE } from '../styles';


const candleStickStyle = {
  data: {
    stroke: 'transparent',
  },
};

const chartContainerStyle = {
  marginTop: 20,
};

const innerChartStyle = {
  padding: {
    bottom: 20,
    left: 40,
    right: 20,
  },
};


export default class PriceVolumeChart extends Component {
  static propTypes = {
    ohlcPeriod: PropTypes.array,
    currencySymbol: PropTypes.string,
    timeframe: PropTypes.string,
    lastReceiveTime: PropTypes.number,
    isFetching: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    const { isFetching, lastReceiveTime } = this.props;
    if (isFetching !== nextProps.isFetching || lastReceiveTime !== nextProps.lastReceiveTime) {
      return true;
    }
    return false;
  }

  formatTimestampByPeriod(timestamp) {
    const { timeframe } = this.props;
    return moment(timestamp).format(timeframeFormat[timeframe]);
  }

  render() {
    const { ohlcPeriod, currencySymbol } = this.props;

    let timeDomain;
    let priceDomain;
    let maxVolume;
    if (ohlcPeriod) {
      timeDomain = [new Date(ohlcPeriod[0][0] * 1000), new Date(ohlcPeriod[ohlcPeriod.length - 1][0] * 1000)];
      priceDomain = [minBy(ohlcPeriod, e => e[1])[1] * 0.99, maxBy(ohlcPeriod, e => e[1])[1] * 1.01];
      maxVolume = maxBy(ohlcPeriod, e => e[5])[5] * 5;
    }
    return (
      <View style={!ohlcPeriod ? styles.container : {}}>
        {ohlcPeriod
          ? <Svg width="100%" height={300} style={chartContainerStyle}>
            <G>
              <VictoryBar
                standalone={false}
                scale="time"
                data={ohlcPeriod}
                x={d => new Date(d[0] * 1000)}
                y={5}
                sortKey="x"
                domain={{
                  x: timeDomain,
                  y: [0, maxVolume],
                }}
                padding={innerChartStyle.padding}
                style={{
                  data: {
                    fill: 'grey',
                    width: 3,
                  },
                }}
              />

              <VictoryCandlestick
                standalone={false}
                domain={{
                  x: timeDomain,
                  y: priceDomain,
                }}
                data={ohlcPeriod}
                scale="time"
                candleColors={{ positive: 'green', negative: '#ba0d0d' }}
                style={candleStickStyle}
                sortKey="x"
                x={d => new Date(d[0] * 1000)}
                open={1}
                high={2}
                low={3}
                close={4}
                padding={innerChartStyle.padding}
              />
              <VictoryAxis
                standalone={false}
                domain={priceDomain}
                dependentAxis
                orientation="left"
                // offsetX={60}
                tickFormat={x => `${currencySymbol}${x}`}
                style={{
                  tickLabels: { fontSize: 11, padding: 4 /* , fill: 'white'*/ },
                  grid: { stroke: 'grey', strokeDasharray: '3, 3' },
                  axis: { stroke: 'transparent' },
                }}
                padding={innerChartStyle.padding}
              />
              <VictoryAxis
                standalone={false}
                domain={timeDomain}
                scale="time"
                tickFormat={x => this.formatTimestampByPeriod(x)}
                style={{
                  axis: { stroke: 'transparent' },
                  grid: { stroke: 'grey', strokeDasharray: '3, 3' },
                  ticks: { stroke: 'grey' },
                  tickLabels: { fontSize: 9, padding: 4 /* , fill: 'white'*/ },
                }}
                padding={innerChartStyle.padding}
              />
            </G>
          </Svg>
        : <Text>No data</Text>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  loadingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 30,
    marginBottom: 200,
  },
});
