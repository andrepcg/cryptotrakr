import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, Switch, Text, Picker } from 'react-native';
import { connect } from 'react-redux';

// import { toggleActiveNotification, setNotificationExchange } from '../actions/settings';

import Button from '../components/Button';

@connect(

)
export default class Settings extends PureComponent {
  static propTypes = {

  };

  static defaultProps = {
    notificationExchangeId: '',
    exchanges: {},
  };

  static navigationOptions = () => ({
    title: 'Settings',
  })

  render() {
    return (
      <View style={styles.container}>
        {/*<Button onPress={this.handleNotificationToggle} >
          <View style={styles.settingsEntry}>
            <View>
              <Text style={styles.settingTitle}>Persistent Price Notification</Text>
              <Text style={styles.settingSubTitle}>Ongoing notification with up to date price</Text>
            </View>
            <View>
              <Switch
                value={persistentNotification}
                onValueChange={this.handleNotificationToggle}
              />
            </View>
          </View>
        </Button>

        <View style={styles.picker}>
          <View>
            <Text style={styles.settingTitle}>Exchange to track price</Text>
          </View>
          <View>
            <Picker selectedValue={notificationExchangeId} onValueChange={setNotificationExchange}>
              {Object.values(exchanges).map(e =>
                <Picker.Item key={e.name} label={e.name} value={e.id} />,
              )}
            </Picker>
          </View>
        </View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  settingsEntry: {
    borderColor: '#d6d5d9',
    borderBottomWidth: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    borderColor: '#d6d5d9',
    borderBottomWidth: 1,
    padding: 20,
  },
  settingTitle: {
    color: 'black',
    fontSize: 15,
  },
  settingSubTitle: {
    fontSize: 12,
  },
});

