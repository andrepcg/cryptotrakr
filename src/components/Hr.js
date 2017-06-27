import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
} from 'react-native';


const styles = StyleSheet.create({
  line: {
    flex: 1,
    // width: 1,
    backgroundColor: 'white',
  },
});

export default class Hr extends PureComponent {
  static propTypes = {
    lineStyle: PropTypes.object,
    marginLeft: PropTypes.number,
    marginRight: PropTypes.number,
    horizontal: PropTypes.bool,
  };

  static defaultProps = {
    lineColor: 'red',
    marginLeft: 8,
    marginRight: 8,
  };

  render() {
    const { horizontal } = this.props;
    const s = {};
    if (horizontal) s.height = 1;
    else s.width = 1;
    return (
      <View style={{ flexDirection: horizontal ? 'row' : 'column', alignItems: 'center', marginLeft: this.props.marginLeft, marginRight: this.props.marginRight }}>
        <View style={[styles.line, this.props.lineStyle, s]} />
      </View>
    );
  }
}
