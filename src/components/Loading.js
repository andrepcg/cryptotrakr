import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ActivityIndicator, StatusBar } from 'react-native';

// TODO
// app logo
import { appName } from '../config';
import { DARK_BLUE } from '../styles';

const defaultMessage = 'Loading, please wait...';

export default class Loading extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
  };

  static defaultProps = {
    message: defaultMessage,
  };

  render() {
    const message = this.props.message ? this.props.message : defaultMessage;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
        <Text style={[styles.loadingText, styles.logo]}>{appName}</Text>
        <ActivityIndicator
          animating
          style={{ height: 80 }}
          size="large"
          color="white"
        />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DARK_BLUE,
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
