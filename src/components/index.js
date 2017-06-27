import React, { PureComponent, PropTypes } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { ALMOST_WHITE, SUPER_DARKER_BLUE, DARKER_BLUE } from '../../styles';

import Header from './Header';

import BTC from './BTC';
import ETH from './ETH';


export default class MainScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    // title: 'Poupify',
    // headerRight: <Icon name="settings" size={30} color="#fff" />,
    // headerLeft: <Icon name="menu" size={30} color="#fff" />,
    // headerStyle: styles.header,
    // header: <Header
    //   openDrawer={() => navigation.navigate('DrawerOpen')}
    //   openSettings={() => navigation.navigate('Settings')}
    // />,
    // header: null,
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Icon style={{ color: 'white' }} name="menu" size={30} color="#fff" />
    ),
  })

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  openDrawer = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  navigateSettings = () => {
    this.props.navigation.navigate('Settings');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={SUPER_DARKER_BLUE}
          barStyle="light-content"
        />
        <Header
          openDrawer={this.openDrawer}
          openSettings={this.navigateSettings}
        />

        <ScrollableTabView
          scrollWithoutAnimation
          tabBarBackgroundColor={DARKER_BLUE}
          tabBarActiveTextColor={ALMOST_WHITE}
          tabBarInactiveTextColor={ALMOST_WHITE}
          tabBarUnderlineStyle={{ backgroundColor: ALMOST_WHITE }}
        >
          <ETH tabLabel="ETH" />
          <BTC tabLabel="BTC" />
          <BTC tabLabel="LTC" />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: DARKER_BLUE,
    paddingTop: 20,
    flexDirection: 'row',
    height: 80,
  },
});
