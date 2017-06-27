import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Picker } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

// import { ORANGE, RED } from '../../styles';

export default class CurrencyPicker extends PureComponent {
  static propTypes = {
    selected: PropTypes.string,
  };

  static defaultProps = {
    selected: 'None',
  }

  state = {
    opened: false,
  }

  handleClick = () => {
    const { opened } = this.state;
    this.setState({ opened: !opened });
  }

  // renderDropdown() {
  //   return (
  //     <View style={styles.container}>
  //       <TouchableWithoutFeedback onPress={this.handleClick}>

  //       </TouchableWithoutFeedback>
  //     </View>
  //   );
  // }

  render() {
    const { selected } = this.props;
    const { opened } = this.state;
    return (
      <View>
        <Picker
          style={{ width: 100, color: 'white' }}
          selectedValue="teste"
          onValueChange={() => {}}
          mode="dropdown"
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  font: {
    color: 'white',
  }
});
