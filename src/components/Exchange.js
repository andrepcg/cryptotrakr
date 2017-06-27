import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { round, get, find } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import numeral from 'numeral';
import currencySymbol from 'currency-symbol-map';


import Button from './Button';

import { GREEN, RED, ALMOST_WHITE, YELLOW, TRANSPARENT } from '../styles';

import { exchanges } from '../config';

function formatNumber(number) {
  const n = Math.abs(number) < 1e-6 ? 0.00000 : number;
  if (Math.abs(number) < 1) return numeral(n).format('0,0.00000');
  return numeral(n).format('0,0.00');
}

export default class Exchange extends PureComponent {
  static propTypes = {
    favorite: PropTypes.bool,
    last: PropTypes.number,
    high: PropTypes.number,
    low: PropTypes.number,
    absolute: PropTypes.number,
    percentage: PropTypes.number,
    volume: PropTypes.number,
    id: PropTypes.string,
    onFavorite: PropTypes.func,
    onExchangePress: PropTypes.func,
    pair: PropTypes.string,
    openAlertPrompt: PropTypes.func,
  };

  static defaultProps = {
    favorite: false,
    last: 0,
    high: 0,
    low: 0,
    percentage: 0,
    absolute: 0,
    volume: 0,
    id: '',
    onExchangePress: () => {},
    onFavorite: () => {},
    pair: '',
  }

  state = {
    crypto: this.props.pair.substr(0, 3),
    currency: this.props.pair.substr(3, 6),
  }

  getExchangeName() {
    const { id } = this.props;
    return get(find(exchanges, { id }), 'name', id);
  }

  clickFavorite = () => {
    const { onFavorite, id, pair } = this.props;
    onFavorite(pair, id);
  }

  openExchange = () => {
    const { crypto, currency } = this.state;
    const { id, onExchangePress } = this.props;
    onExchangePress(id, this.getExchangeName(), crypto, currency);
  }

  openPrompt = () => {
    const { crypto, currency } = this.state;
    const { id } = this.props;
    this.props.openAlertPrompt(id, crypto, currency);
  }

  renderLastPrice() {
    const { crypto, currency } = this.state;
    const { last, percentage, absolute } = this.props;
    const color = percentage > 0 ? GREEN : RED;
    return (
      <Button style={[styles.last, { backgroundColor: color }]} onPressFunc={this.openPrompt}>
        <Text>
          <Text style={styles.lastFont}>{`${currencySymbol(currency) || crypto}${formatNumber(last)}`}</Text>
          <Text style={[styles.percentageChange, { fontStyle: 'italic' }]}> /{currencySymbol(crypto) || crypto}</Text>
        </Text>
        <Text style={styles.percentageChange}>
          {`${percentage > 0 ? '+' : ''}${round(percentage * 100, 1)}% (${currencySymbol(currency)}${formatNumber(absolute)})`}
        </Text>
      </Button>
    );
  }

  render() {
    const { crypto, currency } = this.state;
    const { high, low, favorite, volume } = this.props;
    return (
      <Button style={styles.card} elevation={0} onPressFunc={this.openExchange}>
        <View style={styles.left}>

          <Button touchableOpacity onPressFunc={this.clickFavorite}>
            {favorite ? starIcon : starOutlineIcon}
          </Button>

          <View style={styles.info}>
            <Text style={styles.title}>{this.getExchangeName()}</Text>
            <Text style={styles.infoFont}><Text style={styles.bold}>High: </Text>{currencySymbol(currency)}{formatNumber(high)}</Text>
            <Text style={styles.infoFont}><Text style={styles.bold}>Low: </Text>{currencySymbol(currency)}{formatNumber(low)}</Text>
            <Text style={styles.infoFont}><Text style={styles.bold}>Volume: </Text>{numeral(volume).format('0a')} {currencySymbol(crypto)}</Text>
          </View>
        </View>

        <View style={styles.right}>
          {this.renderLastPrice()}
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  favicon: {
    padding: 5,
    paddingBottom: 15,
    paddingTop: 15,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    width: 140,
  },
  lastFont: {
    fontSize: 18,
    color: ALMOST_WHITE,
    fontWeight: '900',
  },
  last: {
    flex: 1,
    borderRadius: 3,
    borderColor: TRANSPARENT,
    borderWidth: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },
  infoFont: {
    fontSize: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FCFDFD',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    paddingLeft: 15,
  },
  percentageChange: {
    fontSize: 9,
    color: ALMOST_WHITE,
  },
  bold: {
    fontWeight: '900',
  },
  alertRadioForm: {
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  alertInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTextInput: {
    width: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});

const starIcon = <Icon style={styles.favicon} name="star" size={25} color={YELLOW} />;
const starOutlineIcon = <Icon style={styles.favicon} name="star-outline" size={25} color={YELLOW} />;
