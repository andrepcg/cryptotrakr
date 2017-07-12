import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, Linking, Image } from 'react-native';
import moment from 'moment';

import { SUPER_DARKER_BLUE, darkHeader } from '../styles';
import { appName } from '../config';
import ethereumLogo from '../img/ethereum-logo-white.png';

import Button from './Button';

import { purchaseProduct } from '../actions/purchases';

import metadata from '../metadata.json';

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
        <Button onPressFunc={this.openLink} onLongPressFunc={this.disableAds} style={styles.justify}>
          <Text style={[styles.white, styles.me]}>André Perdigão</Text>
          <Text style={styles.white}>andrepcg.me</Text>
          <Text style={styles.white}>email@andrepcg.me</Text>
        </Button>
        <Text style={styles.white}>Build: {metadata.build} ({moment(Number(metadata.buildDate)).format('YYYY/MM/DD HH:mm')})</Text>
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
