import React, { PropTypes } from 'react';
import { TouchableNativeFeedback, View, TouchableOpacity, Platform } from 'react-native';

import { debounce } from 'lodash';

export default function Button(props) {
  const { onPressFunc, onLongPressFunc, children, ...rest } = props;

  const passProps = {};
  if (onPressFunc) passProps.onPress = debounce(onPressFunc, 500, { leading: true, trailing: false });
  if (onLongPressFunc) passProps.onLongPress = onLongPressFunc;

  if (!props.touchableOpacity && Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        {...passProps}
      >
        <View {...rest}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        {...passProps}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
  ]),
  touchableOpacity: PropTypes.bool,
  onPressFunc: PropTypes.func,
  onLongPressFunc: PropTypes.func,
};

Button.defaultProps = {
  onPress: () => {},
  onLongPress: () => {},
  touchableOpacity: false,
};
