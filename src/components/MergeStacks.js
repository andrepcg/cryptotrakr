import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { SUPER_DARKER_BLUE, ORANGE } from '../styles';
import Button from './Button';

export default class MergeStacks extends PureComponent {
  static propTypes = {
    stacksCount: PropTypes.number,
    stack: PropTypes.func,
  };

  static defaultProps = {
    stacksCount: 0,
  }

  render() {
    const { stacksCount, stack } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.font}>
          Merging {stacksCount} stacks
        </Text>
        {stacksCount > 1 && <Button touchableOpacity onPressFunc={stack}>
          <Text style={[styles.font, styles.bold, { color: ORANGE }]}>Join</Text>
        </Button>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SUPER_DARKER_BLUE,
    // height: 50,
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  font: {
    fontSize: 15,
    color: 'white',
  },
  bold: {
    fontWeight: '900',
  },
});
