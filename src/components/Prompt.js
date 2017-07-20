import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

export default class Prompt extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    close: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      onPress: PropTypes.func,
    })),
  };

  static defaultProps = {
    visible: false,
  };

  close = () => {
    this.props.close();
  }

  renderOptions() {
    const { options } = this.props;
    return options.map(({ label, onPress, type }) => (
      <TouchableOpacity style={styles.footerButton} key={label} onPress={type === 'cancel' ? this.close : onPress}>
        <Text style={styles.footerText}>{label.toUpperCase()}</Text>
      </TouchableOpacity>
    ));
  }

  render() {
    const { title, children, visible, options } = this.props;
    return (
      <Modal onRequestClose={this.close} transparent visible={visible} animationType="none">
        <View style={styles.dialog}>
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={styles.dialogOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.dialogContent}>
            <View style={styles.dialogTitle}>
              <Text style={styles.dialogTitleText}>{title}</Text>
            </View>
            <View style={styles.dialogBody}>
              { children }
            </View>
            <View style={styles.dialogFooter}>
              {options
                ? this.renderOptions()
                : <TouchableOpacity style={styles.footerText} onPress={this.close}>
                  <Text>OK</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
    alignItems: 'center',
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dialogContent: {
    elevation: 5,
    marginTop: 150,
    width: 340,
    backgroundColor: 'white',
    borderRadius: 2,
    // borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
  },
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
  },
  dialogTitle: {
    marginBottom: 20,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerText: {
    fontWeight: '600',
    color: 'orange',
  },
  footerButton: {
    padding: 5,
    // backgroundColor: 'red',
    marginLeft: 20,
  },
});
