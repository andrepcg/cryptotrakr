import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, Linking, Image } from 'react-native';

import { SUPER_DARKER_BLUE, darkHeader } from '../styles';
import { appName } from '../config';
import ethereumLogo from '../img/ethereum-logo-white.png';

import Button from './Button';

import { purchaseProduct } from '../actions/purchases';

@connect()
export default class About extends PureComponent {
  static navigationOptions = {
    title: 'About',
    ...darkHeader,
    headerTruncatedBackTitle: null,
    headerBackTitle: null,
  };

  static propTypes = {
    dispatch: PropTypes.func,
  }

  openLink = () => {
    Linking.openURL('http://andrepcg.me');
  }

  disableAds = () => {
    this.props.dispatch(purchaseProduct('noads'));
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={ethereumLogo} />
        <Text style={styles.logo}>{appName}</Text>
        {/*<View style={styles.justify}>
          <Text style={styles.white}>
            <Text style={styles.me}>ETH:</Text> 0xc77ab15Ac49aE679028eDa9BEa6db6645aC3b587
          </Text>
          <Text style={styles.white}>
            <Text style={styles.me}>BTC:</Text> 32KXmd73oRymV7Np3RkDG8xQQTkP5Sg4GX
          </Text>
        </View>*/}
        <Button onPressFunc={this.openLink} onLongPressFunc={this.disableAds} style={styles.justify}>
          <Text style={[styles.white, styles.me]}>André Perdigão</Text>
          <Text style={styles.white}>andrepcg.me</Text>
          <Text style={styles.white}>email@andrepcg.me</Text>
        </Button>
      </View>
    );
  }
}

// Icon made by Freepik from www.flaticon.com

const styles = StyleSheet.create({
  justify: {
    alignItems: 'center',
  },
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SUPER_DARKER_BLUE,
  },
  me: {
    fontWeight: 'bold',
  },
  white: {
    color: 'white',
  },
  logo: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
