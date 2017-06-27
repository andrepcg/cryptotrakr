import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';

import { ORANGE, RED } from '../styles';

export default class LastUpdate extends PureComponent {
  static propTypes = {
    lastUpdate: PropTypes.number,
    isFetching: PropTypes.bool,
    isConnected: PropTypes.bool,
  }

  static defaultProps = {
    lastUpdate: null,
    isFetching: false,
    isConnected: false,
  }

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderIsConnected() {
    const { lastUpdate, isFetching } = this.props;
    return isFetching
      ? <Text style={styles.bold}>Last update: Fetching data...</Text>
      : <Text style={styles.bold}>Last update: {!lastUpdate
          ? 'Never'
          : moment(lastUpdate).fromNow()
          }
      </Text>;
  }

  render() {
    const { isConnected } = this.props;
    return (
      <View
        style={[styles.updateStatus, { backgroundColor: isConnected ? ORANGE : RED }]}
        elevation={2}
      >
        <Text style={styles.font}>
          {isConnected
            ? this.renderIsConnected()
            : <Text style={[styles.bold, styles.offline]}>{'Offline'}</Text>
          }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  updateStatus: {
    backgroundColor: ORANGE,
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  font: {
    fontSize: 11,
  },
  bold: {
    fontWeight: '900',
  },
  offline: {
    color: 'white',
  },
});
