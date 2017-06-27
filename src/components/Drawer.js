import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, Image, ToastAndroid, Platform, Linking, ScrollView } from 'react-native';
import { debounce } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from './Button';
import ethereumLogo from '../img/ethereum-logo-white.png';

import { DARKER_BLUE } from '../styles';

const showUnavailable = () => Platform.OS === 'android' && ToastAndroid.show('Future feature', ToastAndroid.SHORT);

export default function Drawer({ navigation }) {
  const navigate = debounce(
    screen => navigation.navigate(screen),
    500,
    { leading: true, trailing: false },
  );

  const openLink = () => {
    Linking.openURL('https://www.paypal.me/andrepcg');
  };

  return (
    <View>
      <View
        style={styles.toolbar}
        elevation={6}
      >
        <Image source={ethereumLogo} style={styles.image} />
      </View>
      <ScrollView>
        <Button style={styles.link} onPressFunc={() => navigate('Portfolio')}>
          <Icon name="wallet" size={25} />
          <Text style={styles.linkName}>Portfolio</Text>
        </Button>
        <Button style={styles.link} onPressFunc={() => navigate('Alerts')}>
          <Icon name="bell-outline" size={25} />
          <Text style={styles.linkName}>Alerts</Text>
        </Button>
        <Button style={styles.link} onPressFunc={showUnavailable} >
          <Icon name="settings" size={25} />
          <Text style={styles.linkName}>Settings</Text>
        </Button>
        <Button style={styles.link} onPressFunc={() => navigate('About')} >
          <Icon name="information-outline" size={25} />
          <Text style={styles.linkName}>About</Text>
        </Button>
        <Button style={styles.link} onPressFunc={openLink} >
          <Icon name="beer" size={25} />
          <Text style={styles.linkName}>Buy me a beer!</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

Drawer.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  link: {
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkName: {
    marginLeft: 20,
  },
  toolbar: {
    // flex: 1,
    backgroundColor: DARKER_BLUE,
    padding: 10,
    height: 140,
    // marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarButton: {
    width: 50,
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
});
