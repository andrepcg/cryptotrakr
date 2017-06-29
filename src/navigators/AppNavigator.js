import React from 'react';
import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tinycolor from 'tinycolor2';

import { appName } from '../config';

import Cryptos from '../containers/Cryptos';
import Portfolio from '../containers/Portfolio';
import PortfolioSold from '../containers/PortfolioSold';
import ExchangeScreen from '../containers/ExchangeScreen';
import SettingsScreen from '../containers/Settings';
import AlertsScreen from '../containers/Alerts';
import AboutScreen from '../components/About';
import PremiumScreen from '../containers/Premium';
import Drawer from '../components/Drawer';
import Button from '../components/Button';
// import Header from '../components/MainScreen/Header';

import { openAddPrompt } from '../actions/portfolio';

import { DARKER_BLUE, ALMOST_WHITE, darkHeader } from '../styles';

const Tabs = TabNavigator({
  AllPairs: {
    screen: () => <Cryptos />,
    navigationOptions: () => ({
      tabBarLabel: 'All',
      tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={20} color={tintColor} />,
    }),
  },
  Favorites: {
    screen: () => <Cryptos onlyFavorites />,
    navigationOptions: () => ({
      tabBarLabel: 'Favorites',
      tabBarIcon: ({ tintColor }) => <Icon name="star" size={20} color={tintColor} />,
    }),
  },
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: ALMOST_WHITE,
    inactiveTintColor: ALMOST_WHITE,
    activeBackgroundColor: tinycolor(DARKER_BLUE).lighten(10).toString(),
    style: {
      backgroundColor: DARKER_BLUE,
    },
    indicatorStyle: {
      backgroundColor: ALMOST_WHITE,
    },
    showIcon: true,
    upperCaseLabel: false,
    tabStyle: { padding: 5, margin: 0 },
    labelStyle: { margin: 0 },
  },
});

const PortfolioTabs = TabNavigator({
  Portfolio: { screen: Portfolio },
  Closed: { screen: PortfolioSold },
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: ALMOST_WHITE,
    inactiveTintColor: ALMOST_WHITE,
    activeBackgroundColor: tinycolor(DARKER_BLUE).lighten(10).toString(),
    style: {
      backgroundColor: DARKER_BLUE,
    },
    indicatorStyle: {
      backgroundColor: ALMOST_WHITE,
    },
    showIcon: true,
    upperCaseLabel: false,
    tabStyle: { padding: 5, margin: 0 },
    labelStyle: { margin: 0 },
  },
});


export const MainNavigator = DrawerNavigator({
  Main: { screen: Tabs },
}, {
  contentComponent: props => <Drawer {...props} />,
  drawerWidth: 270,
});

export default StackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation: { navigate } }) => ({
      title: appName,
      headerStyle: { backgroundColor: DARKER_BLUE, paddingLeft: 20, paddingRight: 20 },
      headerTitleStyle: { color: ALMOST_WHITE },
      headerLeft: <Button touchableOpacity onPressFunc={() => navigate('DrawerOpen')}>
        <Icon name="menu" size={30} color="#fff" />
      </Button>,
      headerRight: <Button touchableOpacity onPressFunc={() => navigate('Alerts')}>
        <Icon name="bell" size={30} color="#fff" style={{ padding: 10 }} />
      </Button>,
      headerTruncatedBackTitle: null,
      headerBackTitle: null,
    }),
  },
  Settings: { screen: SettingsScreen },
  Portfolio: {
    screen: PortfolioTabs,
    navigationOptions: ({ navigation: { dispatch } }) => ({
      title: 'Portfolio',
      ...darkHeader,
      headerRight: <Button touchableOpacity onPressFunc={() => dispatch(openAddPrompt())}>
        <Icon name="plus" size={30} color="#fff" style={{ padding: 10 }} />
      </Button>,
      headerTruncatedBackTitle: null,
      headerBackTitle: null,
    }),
  },
  Alerts: { screen: AlertsScreen },
  Exchange: { screen: ExchangeScreen },
  Premium: { screen: PremiumScreen },
  About: { screen: AboutScreen },
}, {
  headerMode: 'screen',
});
